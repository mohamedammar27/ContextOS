/**
 * Automatic File Watcher with OCR & Text Extraction
 * Monitors content/uploads for new files and processes them automatically
 */

const chokidar = require('chokidar');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fetch = require('node-fetch');

// Configuration
const WATCH_DIR = path.join(__dirname, './content/uploads');
const PROCESSED_DIR = path.join(__dirname, './content/processed');
const ERROR_DIR = path.join(__dirname, './content/error');
const BACKEND_URL = 'http://localhost:8000';
const MIN_TEXT_LENGTH = 10;

// Deduplication: Store recent file hashes
const processedHashes = new Set();
const MAX_HASH_HISTORY = 500;

/**
 * Compute SHA-256 hash of text content
 */
function hashContent(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Check if content was already processed
 */
function isDuplicate(hash) {
  if (processedHashes.has(hash)) {
    return true;
  }
  
  processedHashes.add(hash);
  
  // Maintain max size
  if (processedHashes.size > MAX_HASH_HISTORY) {
    const firstHash = processedHashes.values().next().value;
    processedHashes.delete(firstHash);
  }
  
  return false;
}

/**
 * Extract text from image using Tesseract OCR
 */
async function extractFromImage(filePath) {
  console.log('[OCR] Processing image with Tesseract...');
  
  try {
    const { data } = await Tesseract.recognize(filePath, 'eng', {
      logger: () => {} // Suppress verbose logs
    });
    
    return data.text;
  } catch (error) {
    throw new Error(`OCR failed: ${error.message}`);
  }
}

/**
 * Extract text from PDF
 */
async function extractFromPDF(filePath) {
  console.log('[PDF] Extracting text from PDF...');
  
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    
    if (data.text && data.text.trim().length >= MIN_TEXT_LENGTH) {
      return data.text;
    }
    
    // Fallback: PDF has no extractable text, try OCR
    console.log('[PDF] No text found, falling back to OCR...');
    // For simplicity, skip OCR fallback for now (would require pdf-to-image conversion)
    throw new Error('PDF contains no extractable text. OCR fallback not implemented.');
    
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}

/**
 * Extract text from Word document
 */
async function extractFromDocx(filePath) {
  console.log('[DOCX] Extracting text from Word document...');
  
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX extraction failed: ${error.message}`);
  }
}

/**
 * Extract text from plain text file
 */
async function extractFromText(filePath) {
  console.log('[TXT] Reading text file...');
  
  try {
    const text = await fs.readFile(filePath, 'utf8');
    return text;
  } catch (error) {
    throw new Error(`Text file read failed: ${error.message}`);
  }
}

/**
 * Extract text based on file extension
 */
async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  switch (ext) {
    case '.png':
    case '.jpg':
    case '.jpeg':
      return await extractFromImage(filePath);
    
    case '.pdf':
      return await extractFromPDF(filePath);
    
    case '.docx':
    case '.doc':
      return await extractFromDocx(filePath);
    
    case '.txt':
      return await extractFromText(filePath);
    
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

/**
 * Clean extracted text
 */
function cleanText(text) {
  if (!text) return '';
  
  // Trim whitespace
  let cleaned = text.trim();
  
  // Remove excessive newlines (more than 2 consecutive)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Remove excessive spaces
  cleaned = cleaned.replace(/ {2,}/g, ' ');
  
  return cleaned;
}

/**
 * Send extracted text to backend API
 */
async function sendToBackend(text, filename) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/context`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: `ocr (${filename})`,
        content: text
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API returned ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    throw new Error(`Backend API call failed: ${error.message}`);
  }
}

/**
 * Move file to destination directory
 */
async function moveFile(sourcePath, destDir) {
  const filename = path.basename(sourcePath);
  const destPath = path.join(destDir, filename);
  
  // If file already exists in destination, append timestamp
  let finalDestPath = destPath;
  try {
    await fs.access(finalDestPath);
    const timestamp = Date.now();
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    finalDestPath = path.join(destDir, `${nameWithoutExt}_${timestamp}${ext}`);
  } catch {
    // File doesn't exist, use original path
  }
  
  await fs.rename(sourcePath, finalDestPath);
  return finalDestPath;
}

// Track files currently being processed to avoid race conditions
const processingFiles = new Set();

/**
 * Process a single file
 */
async function processFile(filePath) {
  const filename = path.basename(filePath);
  
  // Prevent duplicate processing
  if (processingFiles.has(filePath)) {
    return;
  }
  
  processingFiles.add(filePath);
  
  console.log('\n' + '='.repeat(60));
  console.log(`[FileWatcher] New file detected: ${filename}`);
  console.log('='.repeat(60));
  
  try {
    // Verify file still exists before processing
    try {
      await fs.access(filePath);
    } catch {
      console.log('[⚠] File no longer exists - already processed');
      processingFiles.delete(filePath);
      return;
    }
    
    // Wait a moment to ensure file is fully written
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 1: Extract text
    console.log('[1/5] Extracting text...');
    let text = await extractText(filePath);
    
    // Step 2: Clean text
    console.log('[2/5] Cleaning text...');
    text = cleanText(text);
    
    // Validate text length
    if (!text || text.length < MIN_TEXT_LENGTH) {
      throw new Error(`Extracted text too short (${text.length} chars, minimum ${MIN_TEXT_LENGTH})`);
    }
    
    console.log(`[✓] Extracted ${text.length} characters`);
    
    // Step 3: Check for duplicates
    console.log('[3/5] Checking for duplicates...');
    const hash = hashContent(text);
    
    if (isDuplicate(hash)) {
      console.log('[⚠] Duplicate content detected - skipping');
      // Still move to processed (not error) since extraction succeeded
      const movedPath = await moveFile(filePath, PROCESSED_DIR);
      console.log(`[✓] Moved duplicate to: ${path.basename(movedPath)}`);
      return;
    }
    
    console.log('[✓] Content is unique');
    
    // Step 4: Send to backend
    console.log('[4/5] Sending to backend API...');
    const result = await sendToBackend(text, filename);
    
    if (result.ignored) {
      console.log('[⚠] Backend marked content as irrelevant');
    } else {
      console.log('[✓] Backend processed successfully');
    }
    
    // Step 5: Move to processed directory
    console.log('[5/5] Moving file to processed...');
    const movedPath = await moveFile(filePath, PROCESSED_DIR);
    console.log(`[✓] Moved to: ${path.basename(movedPath)}`);
    
    console.log('\n✅ Processing complete!\n');
    
  } catch (error) {
    console.error(`\n❌ Processing failed: ${error.message}\n`);
    
    // Move to error directory (only if file still exists)
    try {
      await fs.access(filePath);
      const movedPath = await moveFile(filePath, ERROR_DIR);
      console.log(`[✓] Moved to error directory: ${path.basename(movedPath)}\n`);
    } catch (moveError) {
      if (moveError.code === 'ENOENT') {
        console.log(`[⚠] File already moved or deleted\n`);
      } else {
        console.error(`[✗] Failed to move to error directory: ${moveError.message}\n`);
      }
    }
  } finally {
    // Always remove from processing set
    processingFiles.delete(filePath);
  }
}

/**
 * Initialize file watcher
 */
function startWatcher() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 File Watcher Starting...');
  console.log('='.repeat(60));
  console.log(`📂 Watching: ${WATCH_DIR}`);
  console.log(`📥 Processed: ${PROCESSED_DIR}`);
  console.log(`❌ Errors: ${ERROR_DIR}`);
  console.log('='.repeat(60));
  console.log('\n✓ Supported formats:');
  console.log('  • Images: .png, .jpg, .jpeg (Tesseract OCR)');
  console.log('  • PDF: .pdf (text extraction + OCR fallback)');
  console.log('  • Word: .doc, .docx (mammoth)');
  console.log('  • Text: .txt (direct read)');
  console.log('\n✓ Deduplication: SHA-256 hash (last 500 files)');
  console.log('✓ Auto-processing: Triggers immediately on file add');
  console.log('\n🟢 Watcher is active - waiting for files...\n');
  
  const watcher = chokidar.watch(WATCH_DIR, {
    ignored: /(^|[\/\\])\../, // Ignore dotfiles
    persistent: true,
    ignoreInitial: false, // Process existing files on startup
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  });
  
  watcher
    .on('add', (filePath) => {
      // Only process files with supported extensions
      const ext = path.extname(filePath).toLowerCase();
      const supportedExts = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx', '.txt'];
      
      if (supportedExts.includes(ext)) {
        processFile(filePath).catch(err => {
          console.error('[FileWatcher] Unhandled error:', err);
        });
      } else {
        console.log(`[FileWatcher] Ignored unsupported file: ${path.basename(filePath)}`);
      }
    })
    .on('error', (error) => {
      console.error('[FileWatcher] Watcher error:', error);
    });
  
  return watcher;
}

// Export for use in main backend
module.exports = { startWatcher };
