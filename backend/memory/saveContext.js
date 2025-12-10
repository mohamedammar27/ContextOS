const path = require('path');
const { writeJSON, readJSON, formatDate, ensureDirectory } = require('./helpers');

const MEMORY_DIR = path.join(__dirname, '../memory');
const LOGS_DIR = path.join(MEMORY_DIR, 'logs');
const INDEX_FILE = path.join(MEMORY_DIR, 'context-index.json');

/**
 * Appends a new context entry to today's log file
 * @param {string} source - Source of the context (e.g., 'slack', 'discord', 'github')
 * @param {string} content - The actual content/text to save
 * @returns {Promise<Object>} The created entry
 */
async function appendContext(source, content) {
  // Ensure logs directory exists
  await ensureDirectory(LOGS_DIR);
  
  // Get today's date
  const today = formatDate(new Date());
  const logFilePath = path.join(LOGS_DIR, `${today}.json`);
  
  // Create the entry
  const entry = {
    timestamp: new Date().toISOString(),
    source: source,
    content: content
  };
  
  // Read existing entries or create new array
  const existingEntries = await readJSON(logFilePath, []);
  
  // Append new entry
  existingEntries.push(entry);
  
  // Write back to file
  await writeJSON(logFilePath, existingEntries);
  
  // Update index
  await updateIndex(source);
  
  console.log(`[Memory] Saved context from ${source} to ${today}.json`);
  
  return entry;
}

/**
 * Updates the context index with new entry metadata
 * @param {string} source - Source of the context
 */
async function updateIndex(source) {
  // Read existing index or create new
  const index = await readJSON(INDEX_FILE, {
    totalEntries: 0,
    entriesPerSource: {}
  });
  
  // Increment totals
  index.totalEntries += 1;
  index.entriesPerSource[source] = (index.entriesPerSource[source] || 0) + 1;
  
  // Write back
  await writeJSON(INDEX_FILE, index);
}

/**
 * Gets the current index statistics
 * @returns {Promise<Object>} Index data
 */
async function getIndex() {
  return await readJSON(INDEX_FILE, {
    totalEntries: 0,
    entriesPerSource: {}
  });
}

module.exports = {
  appendContext,
  updateIndex,
  getIndex
};
