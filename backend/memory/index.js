/**
 * ContextOS Memory Engine
 * 
 * A lightweight filesystem-based memory system for storing and retrieving context data.
 * No database required - uses simple JSON files organized by date.
 * 
 * @module memory
 */

const { appendContext, getIndex } = require('./saveContext');
const { 
  loadDay, 
  loadRange, 
  loadBySource, 
  loadRecent, 
  searchContext 
} = require('./loadContext');
const { 
  cleanupOldLogs, 
  rebuildIndex, 
  getCleanupConfig, 
  setCleanupConfig,
  getCleanupStats
} = require('./cleanup');

module.exports = {
  // Save operations
  appendContext,
  getIndex,
  
  // Load operations
  loadDay,
  loadRange,
  loadBySource,
  loadRecent,
  searchContext,
  
  // Cleanup operations
  cleanupOldLogs,
  rebuildIndex,
  getCleanupConfig,
  setCleanupConfig,
  getCleanupStats
};
