const fs = require('fs').promises;
const path = require('path');

const MEMORY_DIR = path.join(__dirname);
const PROCESSED_DIR = path.join(MEMORY_DIR, 'processed');

/**
 * Ensures a directory exists, creates it if necessary
 * @param {string} dirPath - Directory path to ensure
 */
async function ensureDirectory(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Formats a timestamp to YYYY-MM-DD
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Date in YYYY-MM-DD format
 */
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Appends a processed entry to the daily log
 * @param {Object} processed - Processed context object
 * @param {string} processed.summary - Summary of the content
 * @param {Array} processed.tasks - Extracted tasks
 * @param {Object} processed.entities - Detected entities
 * @param {Object} processed.metadata - Metadata with source, timestamp, contentType
 * @returns {Promise<Object>} The appended entry
 */
async function appendProcessedEntry(processed) {
  // Validate input
  if (!processed || !processed.metadata || !processed.metadata.timestamp) {
    throw new Error('Invalid processed entry: metadata.timestamp is required');
  }

  const { summary, tasks, entities, metadata } = processed;

  // Validate structure
  if (!summary || !Array.isArray(tasks) || !entities || !metadata) {
    throw new Error('Invalid processed entry structure: missing required fields');
  }

  try {
    // Ensure processed directory exists
    await ensureDirectory(PROCESSED_DIR);

    // Get date from timestamp
    const dateStr = formatDate(metadata.timestamp);
    const filePath = path.join(PROCESSED_DIR, `${dateStr}.json`);

    // Read existing entries or initialize empty array
    let entries = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      entries = JSON.parse(fileContent);
      if (!Array.isArray(entries)) {
        entries = [];
      }
    } catch (error) {
      // File doesn't exist or is invalid, start fresh
      entries = [];
    }

    // Append new entry
    const entry = {
      summary,
      tasks,
      entities,
      metadata
    };
    entries.push(entry);

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(entries, null, 2), 'utf-8');

    console.log(`[ProcessedMemory] Saved processed entry to ${dateStr}.json (${tasks.length} tasks, ${Object.values(entities).flat().length} entities)`);

    return entry;

  } catch (error) {
    console.error('[ProcessedMemory] Error saving processed entry:', error.message);
    throw error;
  }
}

/**
 * Loads all processed entries for a specific day
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of processed entries for that day
 */
async function loadProcessedDay(dateStr) {
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error('Invalid date format: expected YYYY-MM-DD');
  }

  const filePath = path.join(PROCESSED_DIR, `${dateStr}.json`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const entries = JSON.parse(fileContent);

    if (!Array.isArray(entries)) {
      console.warn(`[ProcessedMemory] Invalid data in ${dateStr}.json, returning empty array`);
      return [];
    }

    console.log(`[ProcessedMemory] Loaded ${entries.length} processed entries from ${dateStr}.json`);
    return entries;

  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      console.log(`[ProcessedMemory] No processed entries for ${dateStr}`);
      return [];
    }

    // Other errors
    console.error(`[ProcessedMemory] Error loading ${dateStr}.json:`, error.message);
    return [];
  }
}

module.exports = {
  appendProcessedEntry,
  loadProcessedDay
};
