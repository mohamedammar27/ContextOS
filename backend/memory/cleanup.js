const fs = require('fs').promises;
const path = require('path');
const { readJSON, writeJSON, listLogFiles, getFileAge, parseDate } = require('./helpers');

const MEMORY_DIR = path.join(__dirname, '../memory');
const LOGS_DIR = path.join(MEMORY_DIR, 'logs');
const CONFIG_FILE = path.join(MEMORY_DIR, 'cleanup-config.json');
const INDEX_FILE = path.join(MEMORY_DIR, 'context-index.json');

/**
 * Gets the cleanup configuration
 * @returns {Promise<Object>} Cleanup config with retentionDays
 */
async function getCleanupConfig() {
  const defaultConfig = { retentionDays: 30 };
  const config = await readJSON(CONFIG_FILE, defaultConfig);
  
  // If config file doesn't exist, create it with defaults
  if (!config || typeof config.retentionDays !== 'number') {
    await writeJSON(CONFIG_FILE, defaultConfig);
    return defaultConfig;
  }
  
  return config;
}

/**
 * Updates the cleanup configuration
 * @param {number} retentionDays - Number of days to retain logs
 */
async function setCleanupConfig(retentionDays) {
  if (typeof retentionDays !== 'number' || retentionDays < 1) {
    throw new Error('retentionDays must be a positive number');
  }
  
  await writeJSON(CONFIG_FILE, { retentionDays });
  console.log(`[Cleanup] Retention period set to ${retentionDays} days`);
}

/**
 * Cleans up log files older than retention period
 * @returns {Promise<Object>} Cleanup results
 */
async function cleanupOldLogs() {
  try {
    // 1. Read retentionDays from cleanup-config.json
    const config = await getCleanupConfig();
    const retentionDays = config.retentionDays;
    
    console.log(`[Cleanup] Starting cleanup with ${retentionDays} day retention`);
    
    // 2. Compute cutoff timestamp
    const cutoffTimestamp = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
    
    // 3. Read all files from logs directory
    let files;
    try {
      files = await fs.readdir(LOGS_DIR);
    } catch (error) {
      console.log('[Cleanup] No logs directory found');
      return {
        deletedFiles: [],
        keptFiles: 0,
        freedSpace: 0
      };
    }
    
    // Filter only .json files
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      console.log('[Cleanup] No log files found');
      return {
        deletedFiles: [],
        keptFiles: 0,
        freedSpace: 0
      };
    }
    
    const deletedFiles = [];
    let freedSpace = 0;
    
    // 4. Check each JSON file
    for (const fileName of jsonFiles) {
      // Extract date string (YYYY-MM-DD) from filename
      const dateString = fileName.replace('.json', '');
      
      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        console.log(`[Cleanup] Skipping invalid filename: ${fileName}`);
        continue;
      }
      
      // Convert YYYY-MM-DD string to timestamp
      const fileTimestamp = new Date(dateString).getTime();
      
      // Check if conversion was successful
      if (isNaN(fileTimestamp)) {
        console.log(`[Cleanup] Skipping invalid date: ${fileName}`);
        continue;
      }
      
      // If file timestamp is older than cutoff, delete it
      if (fileTimestamp < cutoffTimestamp) {
        const filePath = path.join(LOGS_DIR, fileName);
        
        try {
          // Get file size before deleting
          const stats = await fs.stat(filePath);
          freedSpace += stats.size;
          
          // Delete the file
          await fs.unlink(filePath);
          
          deletedFiles.push(fileName);
          console.log(`[Cleanup] Deleted: ${fileName} (age: ${Math.floor((Date.now() - fileTimestamp) / (24 * 60 * 60 * 1000))} days)`);
        } catch (error) {
          console.error(`[Cleanup] Error deleting ${fileName}:`, error.message);
        }
      }
    }
    
    // Rebuild index after cleanup
    if (deletedFiles.length > 0) {
      await rebuildIndex();
    }
    
    const result = {
      deletedFiles,
      keptFiles: jsonFiles.length - deletedFiles.length,
      freedSpace
    };
    
    console.log(`[Cleanup] Completed: Deleted ${deletedFiles.length} files, Freed ${(freedSpace / 1024).toFixed(2)} KB`);
    
    return result;
  } catch (error) {
    console.error('[Cleanup] Error during cleanup:', error);
    throw error;
  }
}

/**
 * Rebuilds the context index by scanning all log files
 * @returns {Promise<Object>} Rebuilt index
 */
async function rebuildIndex() {
  console.log('[Cleanup] Rebuilding index...');
  
  const logFiles = await listLogFiles(LOGS_DIR);
  
  const index = {
    totalEntries: 0,
    entriesPerSource: {}
  };
  
  // Scan all remaining log files
  for (const fileName of logFiles) {
    const filePath = path.join(LOGS_DIR, fileName);
    const entries = await readJSON(filePath, []);
    
    for (const entry of entries) {
      index.totalEntries += 1;
      const source = entry.source || 'unknown';
      index.entriesPerSource[source] = (index.entriesPerSource[source] || 0) + 1;
    }
  }
  
  // Write rebuilt index
  await writeJSON(INDEX_FILE, index);
  
  console.log(`[Cleanup] Index rebuilt: ${index.totalEntries} total entries across ${Object.keys(index.entriesPerSource).length} sources`);
  
  return index;
}

/**
 * Gets cleanup statistics
 * @returns {Promise<Object>} Statistics about logs and potential cleanup
 */
async function getCleanupStats() {
  const config = await getCleanupConfig();
  const logFiles = await listLogFiles(LOGS_DIR);
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - config.retentionDays);
  
  let totalSize = 0;
  let oldSize = 0;
  let oldCount = 0;
  
  for (const fileName of logFiles) {
    const filePath = path.join(LOGS_DIR, fileName);
    const stats = await fs.stat(filePath);
    totalSize += stats.size;
    
    const dateString = fileName.replace('.json', '');
    const fileDate = parseDate(dateString);
    
    if (fileDate < cutoffDate) {
      oldSize += stats.size;
      oldCount += 1;
    }
  }
  
  return {
    totalFiles: logFiles.length,
    totalSize,
    oldFiles: oldCount,
    oldSize,
    retentionDays: config.retentionDays,
    potentialFreedSpace: oldSize
  };
}

module.exports = {
  cleanupOldLogs,
  rebuildIndex,
  getCleanupConfig,
  setCleanupConfig,
  getCleanupStats
};
