const fs = require('fs').promises;
const path = require('path');

/**
 * Ensures a directory exists, creating it if necessary
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
 * Safely reads and parses a JSON file
 * @param {string} filePath - Path to JSON file
 * @param {*} defaultValue - Default value if file doesn't exist
 * @returns {Promise<*>} Parsed JSON or default value
 */
async function readJSON(filePath, defaultValue = null) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return defaultValue;
    }
    throw error;
  }
}

/**
 * Safely writes data to a JSON file
 * @param {string} filePath - Path to JSON file
 * @param {*} data - Data to write
 */
async function writeJSON(filePath, data) {
  const dirPath = path.dirname(filePath);
  await ensureDirectory(dirPath);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Formats a date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a date string (YYYY-MM-DD) to Date object
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Date} Date object
 */
function parseDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Gets all dates between start and end (inclusive)
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {string[]} Array of date strings in YYYY-MM-DD format
 */
function getDateRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Lists all log files in the logs directory
 * @param {string} logsDir - Path to logs directory
 * @returns {Promise<string[]>} Array of log file names
 */
async function listLogFiles(logsDir) {
  try {
    const files = await fs.readdir(logsDir);
    return files.filter(file => file.endsWith('.json') && file.match(/^\d{4}-\d{2}-\d{2}\.json$/));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Gets the age of a file in days
 * @param {string} filePath - Path to file
 * @returns {Promise<number>} Age in days
 */
async function getFileAge(filePath) {
  const stats = await fs.stat(filePath);
  const now = new Date();
  const fileDate = new Date(stats.mtime);
  const diffTime = Math.abs(now - fileDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

module.exports = {
  ensureDirectory,
  readJSON,
  writeJSON,
  formatDate,
  parseDate,
  getDateRange,
  listLogFiles,
  getFileAge
};
