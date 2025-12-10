# Task Normalization System

## Overview

The normalization system ensures **all daily plan tasks always contain `taskNumber` and `completed` fields**, regardless of whether the raw plan from the extension or LLM includes them.

## Key Features

✅ **Automatic field addition** - Missing `taskNumber` and `completed` fields are automatically added  
✅ **Preservation of existing data** - If fields already exist, their values are preserved  
✅ **Sequential task numbering** - focusTasks numbered 1-N, otherTasks numbered N+1 onwards  
✅ **Auto-correction of old JSON** - Legacy JSON files are automatically updated when loaded  
✅ **Applied everywhere** - Normalization runs on both save and load operations  
✅ **Fallback-safe** - Even LLM failure fallback plans are normalized  

## Architecture

### Core Functions

#### `normalizeTasks(tasks, startNumber)`
Located in: `backend/memory/dailyPlanMemory.js`

Normalizes an array of tasks to ensure each has:
- `taskNumber`: Sequential number starting from `startNumber` (default: 1)
- `completed`: Boolean flag (defaults to `false` if missing)

```javascript
// Input
[
  { title: 'Task 1', priority: 'high' },
  { title: 'Task 2', completed: true }
]

// Output
[
  { title: 'Task 1', priority: 'high', taskNumber: 1, completed: false },
  { title: 'Task 2', completed: true, taskNumber: 2 }
]
```

#### `normalizePlan(plan)`
Located in: `backend/memory/dailyPlanMemory.js`

Normalizes an entire plan object:
- Applies `normalizeTasks()` to `focusTasks` (starting at 1)
- Applies `normalizeTasks()` to `otherTasks` (continuing from focusTasks count)
- Updates `metadata.totalTasks` to reflect actual task count
- Adds `metadata.normalizedAt` timestamp

```javascript
// Input
{
  focusTasks: [{ title: 'Focus 1' }],
  otherTasks: [{ title: 'Other 1' }, { title: 'Other 2' }]
}

// Output
{
  focusTasks: [
    { title: 'Focus 1', taskNumber: 1, completed: false }
  ],
  otherTasks: [
    { title: 'Other 1', taskNumber: 2, completed: false },
    { title: 'Other 2', taskNumber: 3, completed: false }
  ],
  metadata: {
    totalTasks: 3,
    normalizedAt: '2025-12-09T18:47:14.652Z'
  }
}
```

## Integration Points

### 1. Plan Generation (`dailyPlanner.js`)
When generating a new plan:
```javascript
const { generateDailyPlan } = require('./daily/dailyPlanner');

// Normalization happens automatically inside generateDailyPlan()
// 1. LLM generates raw plan
// 2. normalizePlan() from dailyPlanner maps task numbers to objects
// 3. normalizeFullPlan() from dailyPlanMemory adds taskNumber/completed
// 4. saveDailyPlan() normalizes again before saving to disk
```

### 2. Plan Saving (`dailyPlanMemory.js`)
When saving any plan:
```javascript
const { saveDailyPlan } = require('./memory/dailyPlanMemory');

await saveDailyPlan('2025-12-10', plan);
// Automatically normalizes before writing to JSON file
```

### 3. Plan Loading (`dailyPlanMemory.js`)
When loading any plan:
```javascript
const { loadDailyPlan } = require('./memory/dailyPlanMemory');

const plan = await loadDailyPlan('2025-12-10');
// 1. Loads JSON file
// 2. Normalizes the plan
// 3. Detects if fields were missing
// 4. Auto-saves corrected version back to disk
// 5. Returns normalized plan
```

### 4. API Endpoints (`index.js`)
All API endpoints automatically benefit from normalization:

```javascript
// GET /api/daily-plan?date=2025-12-10
// Returns normalized plan (loadDailyPlan handles it)

// POST /api/daily-plan/generate?date=2025-12-10
// Generates and saves normalized plan (generateDailyPlan + saveDailyPlan handle it)

// PATCH /api/tasks/:taskId
// Loads plan (normalized), updates task, saves plan (normalized again)
```

## Behavior Examples

### Example 1: New Plan Generation
```javascript
// LLM returns raw plan without taskNumber/completed
{
  focusTasks: [
    { title: 'Finish report', priority: 'high' }
  ],
  otherTasks: [
    { title: 'Email client', priority: 'medium' }
  ]
}

// After normalization (before save)
{
  focusTasks: [
    { title: 'Finish report', priority: 'high', taskNumber: 1, completed: false }
  ],
  otherTasks: [
    { title: 'Email client', priority: 'medium', taskNumber: 2, completed: false }
  ]
}
```

### Example 2: Loading Old JSON
```javascript
// Old JSON file (2025-12-08.json) missing fields
{
  "focusTasks": [
    { "title": "Old task", "priority": "high" }
  ]
}

// After loadDailyPlan() auto-correction
{
  "focusTasks": [
    { "title": "Old task", "priority": "high", "taskNumber": 1, "completed": false }
  ],
  "metadata": {
    "normalizedAt": "2025-12-09T18:47:14.652Z"
  }
}

// File is automatically saved with corrections
```

### Example 3: Task Completion Update
```javascript
// User toggles task #2 to completed
// PATCH /api/tasks/2 with { completed: true }

// Plan is loaded (normalized), task updated, then saved (normalized again)
{
  otherTasks: [
    { title: 'Task 2', taskNumber: 2, completed: true }
  ]
}
```

## Testing

Run the test suite:
```bash
cd backend
node test-normalization.js
```

Tests verify:
- ✅ Adding missing fields to tasks without any fields
- ✅ Preserving existing `taskNumber` and `completed` values
- ✅ Sequential numbering across focusTasks and otherTasks
- ✅ Handling empty task arrays
- ✅ Filtering out invalid/malformed tasks

## Guarantees

The normalization system guarantees:

1. **Every task has `taskNumber`** - Sequential integer starting from 1
2. **Every task has `completed`** - Boolean, defaults to `false`
3. **Consistent numbering** - focusTasks: 1-N, otherTasks: N+1 onwards
4. **No data loss** - Existing field values are always preserved
5. **Automatic correction** - Old JSON files are fixed on first load
6. **Type safety** - Invalid tasks are filtered out
7. **Idempotent** - Running normalization multiple times produces same result

## Migration Path

### For existing JSON files:
1. **No manual action required** - Files are auto-corrected on first load
2. **Verification** - Check logs for "Auto-correcting missing fields in {date}.json"
3. **Backup** - Original files are overwritten with corrected versions

### For new plans:
1. **Automatic** - All new plans are normalized before saving
2. **LLM-agnostic** - Works regardless of what LLM returns
3. **Fallback-safe** - Even emergency fallback plans are normalized

## Error Handling

- **Invalid tasks** - Filtered out (null, undefined, non-objects)
- **Missing arrays** - Treated as empty arrays `[]`
- **Malformed plans** - Individual fields are normalized, structure preserved
- **Save failures** - Normalization still returns correct data

## Performance

- **Minimal overhead** - O(n) complexity where n = number of tasks
- **No database calls** - Pure in-memory transformation
- **Auto-save only when needed** - File is only written if changes detected

## Logging

Watch for these log messages:

```
[DailyPlanMemory] Saved daily plan for 2025-12-10
[DailyPlanMemory] Focus tasks: 3, Other tasks: 17

[DailyPlanMemory] Loaded daily plan for 2025-12-08
[DailyPlanMemory] Auto-correcting missing fields in 2025-12-08.json
[DailyPlanMemory] Focus tasks: 3, Total tasks: 20
```

## API Contract

### Task Object Schema
```typescript
interface Task {
  title: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
  source?: string;
  taskNumber: number;        // ← Always present after normalization
  completed: boolean;        // ← Always present after normalization
  [key: string]: any;        // Other fields preserved
}
```

### Plan Object Schema
```typescript
interface DailyPlan {
  date: string;
  daySummary: string;
  focusTasks: Task[];        // ← Normalized (taskNumber 1-N)
  otherTasks: Task[];        // ← Normalized (taskNumber N+1 onwards)
  reminders: string[];
  scheduleSuggestions: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
  metadata: {
    totalTasks: number;
    normalizedAt?: string;   // ← Added by normalization
    [key: string]: any;
  };
}
```

## Future Enhancements

Potential improvements:
- [ ] Add validation rules (e.g., taskNumber must be unique)
- [ ] Support custom numbering schemes
- [ ] Add normalization metrics/telemetry
- [ ] Batch normalization tool for all existing JSON files
- [ ] Migration script for specific schema changes

## Related Files

- `backend/memory/dailyPlanMemory.js` - Core normalization functions
- `backend/daily/dailyPlanner.js` - Plan generation with normalization
- `backend/index.js` - API endpoints using normalized plans
- `backend/test-normalization.js` - Test suite
- `ui/lib/api.ts` - Frontend TypeScript interfaces matching normalized schema
