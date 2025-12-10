# ContextOS Memory Engine

A lightweight, filesystem-based memory system for ContextOS. No database required - uses simple JSON files organized by date.

## Features

- 📁 **Filesystem-based**: Pure Node.js filesystem operations
- 📅 **Date-organized**: One JSON file per day (YYYY-MM-DD.json)
- 🔍 **Fast indexing**: Lightweight metadata tracking
- 🧹 **Auto-cleanup**: Configurable retention period
- 🚀 **Zero dependencies**: Only uses Node.js built-in modules

## Directory Structure

```
backend/memory/
├── logs/                    # Daily log files
│   ├── 2025-12-07.json
│   ├── 2025-12-08.json
│   └── ...
├── context-index.json       # Metadata index
├── cleanup-config.json      # Cleanup configuration
├── index.js                 # Main export
├── saveContext.js           # Save operations
├── loadContext.js           # Load operations
├── cleanup.js               # Cleanup operations
└── helpers.js               # Utility functions
```

## Usage

### Save Context

```javascript
const memory = require('./memory');

// Append new context
await memory.appendContext('github', 'User opened PR #123');
await memory.appendContext('slack', 'Meeting scheduled for 3pm');
```

### Load Context

```javascript
// Load specific day
const entries = await memory.loadDay('2025-12-08');

// Load date range
const rangeData = await memory.loadRange('2025-12-01', '2025-12-08');

// Load by source
const githubEntries = await memory.loadBySource('github');

// Load recent entries
const recent = await memory.loadRecent(20);

// Search context
const results = await memory.searchContext('meeting');
```

### Cleanup

```javascript
// Run cleanup (deletes files older than retention period)
const result = await memory.cleanupOldLogs();
console.log(`Deleted ${result.deletedFiles.length} files`);

// Get cleanup statistics
const stats = await memory.getCleanupStats();
console.log(`${stats.oldFiles} files ready for cleanup`);

// Change retention period
await memory.setCleanupConfig(60); // Keep logs for 60 days
```

### Index Management

```javascript
// Get current index
const index = await memory.getIndex();
console.log(`Total entries: ${index.totalEntries}`);
console.log('Per source:', index.entriesPerSource);

// Rebuild index (if corrupted)
await memory.rebuildIndex();
```

## Entry Format

Each context entry has the following structure:

```json
{
  "timestamp": "2025-12-08T10:30:00.000Z",
  "source": "github",
  "content": "User opened PR #123"
}
```

## Index Format

The `context-index.json` file tracks metadata:

```json
{
  "totalEntries": 156,
  "entriesPerSource": {
    "github": 45,
    "slack": 67,
    "discord": 44
  }
}
```

## Cleanup Configuration

The `cleanup-config.json` file controls retention:

```json
{
  "retentionDays": 30
}
```

## API Reference

### Save Operations

- `appendContext(source, content)` - Append new context to today's log
- `getIndex()` - Get current index statistics

### Load Operations

- `loadDay(date)` - Load all entries for a specific date
- `loadRange(startDate, endDate)` - Load entries within date range
- `loadBySource(source, startDate?, endDate?)` - Filter entries by source
- `loadRecent(count)` - Get most recent N entries
- `searchContext(searchTerm, startDate?, endDate?)` - Search within content

### Cleanup Operations

- `cleanupOldLogs()` - Delete files older than retention period
- `rebuildIndex()` - Rebuild index from scratch
- `getCleanupConfig()` - Get current cleanup config
- `setCleanupConfig(retentionDays)` - Update retention period
- `getCleanupStats()` - Get cleanup statistics

## Integration with Backend

Add to your Express routes:

```javascript
const memory = require('./memory');

// Save captured context
app.post('/api/context', async (req, res) => {
  const { source, content } = req.body;
  const entry = await memory.appendContext(source, content);
  res.json({ success: true, entry });
});

// Get recent context
app.get('/api/context/recent', async (req, res) => {
  const entries = await memory.loadRecent(50);
  res.json(entries);
});

// Search context
app.get('/api/context/search', async (req, res) => {
  const { q } = req.query;
  const results = await memory.searchContext(q);
  res.json(results);
});

// Run cleanup
app.post('/api/context/cleanup', async (req, res) => {
  const result = await memory.cleanupOldLogs();
  res.json(result);
});
```

## Scheduled Cleanup

Set up a cron job to run cleanup automatically:

```javascript
const cron = require('node-cron');
const memory = require('./memory');

// Run cleanup every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('[Cron] Running scheduled cleanup...');
  const result = await memory.cleanupOldLogs();
  console.log(`[Cron] Cleanup completed: ${result.deletedFiles.length} files deleted`);
});
```

## Production Notes

1. **Performance**: Designed for moderate volumes (thousands of entries per day)
2. **Concurrency**: Uses async/await for non-blocking operations
3. **Error Handling**: Gracefully handles missing files and directories
4. **Auto-creation**: Directories and files are created automatically
5. **Memory Safe**: Loads files on-demand, doesn't keep everything in memory

## License

Part of ContextOS - All rights reserved
