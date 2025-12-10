const path = require('path');
const { readJSON, formatDate, parseDate, getDateRange } = require('./helpers');

const MEMORY_DIR = path.join(__dirname, '../memory');
const LOGS_DIR = path.join(MEMORY_DIR, 'logs');

/**
 * Loads all context entries for a specific date
 * @param {string|Date} date - Date string (YYYY-MM-DD) or Date object
 * @returns {Promise<Array>} Array of context entries
 */
async function loadDay(date) {
  const dateString = typeof date === 'string' ? date : formatDate(date);
  const logFilePath = path.join(LOGS_DIR, `${dateString}.json`);
  
  const entries = await readJSON(logFilePath, []);
  
  console.log(`[Memory] Loaded ${entries.length} entries from ${dateString}.json`);
  
  return entries;
}

/**
 * Loads all context entries within a date range
 * @param {string|Date} startDate - Start date (YYYY-MM-DD) or Date object
 * @param {string|Date} endDate - End date (YYYY-MM-DD) or Date object
 * @returns {Promise<Object>} Object with date as key and entries as value
 */
async function loadRange(startDate, endDate) {
  const start = typeof startDate === 'string' ? parseDate(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseDate(endDate) : endDate;
  
  // Get all dates in range
  const dates = getDateRange(start, end);
  
  // Load entries for each date
  const result = {};
  let totalEntries = 0;
  
  for (const dateString of dates) {
    const entries = await loadDay(dateString);
    if (entries.length > 0) {
      result[dateString] = entries;
      totalEntries += entries.length;
    }
  }
  
  console.log(`[Memory] Loaded ${totalEntries} total entries from ${dates.length} days`);
  
  return result;
}

/**
 * Loads entries filtered by source
 * @param {string} source - Source to filter by
 * @param {string|Date} startDate - Start date (optional)
 * @param {string|Date} endDate - End date (optional)
 * @returns {Promise<Array>} Filtered entries
 */
async function loadBySource(source, startDate = null, endDate = null) {
  let entries = [];
  
  if (startDate && endDate) {
    const rangeData = await loadRange(startDate, endDate);
    // Flatten all entries from all dates
    entries = Object.values(rangeData).flat();
  } else {
    // Load today only
    entries = await loadDay(new Date());
  }
  
  // Filter by source
  const filtered = entries.filter(entry => entry.source === source);
  
  console.log(`[Memory] Found ${filtered.length} entries from source: ${source}`);
  
  return filtered;
}

/**
 * Loads the most recent N entries
 * @param {number} count - Number of recent entries to load
 * @returns {Promise<Array>} Most recent entries
 */
async function loadRecent(count = 10) {
  const today = new Date();
  const entries = [];
  
  // Go back up to 30 days to find entries
  for (let i = 0; i < 30 && entries.length < count; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayEntries = await loadDay(date);
    
    // Add entries in reverse order (newest first)
    for (let j = dayEntries.length - 1; j >= 0 && entries.length < count; j--) {
      entries.push(dayEntries[j]);
    }
  }
  
  console.log(`[Memory] Loaded ${entries.length} recent entries`);
  
  return entries;
}

/**
 * Searches for entries containing specific text
 * @param {string} searchTerm - Text to search for
 * @param {string|Date} startDate - Start date (optional)
 * @param {string|Date} endDate - End date (optional)
 * @returns {Promise<Array>} Matching entries
 */
async function searchContext(searchTerm, startDate = null, endDate = null) {
  let entries = [];
  
  if (startDate && endDate) {
    const rangeData = await loadRange(startDate, endDate);
    entries = Object.values(rangeData).flat();
  } else {
    // Search last 7 days by default
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    const rangeData = await loadRange(start, end);
    entries = Object.values(rangeData).flat();
  }
  
  // Search in content
  const searchLower = searchTerm.toLowerCase();
  const matches = entries.filter(entry => 
    entry.content.toLowerCase().includes(searchLower)
  );
  
  console.log(`[Memory] Found ${matches.length} entries matching: ${searchTerm}`);
  
  return matches;
}

module.exports = {
  loadDay,
  loadRange,
  loadBySource,
  loadRecent,
  searchContext
};
