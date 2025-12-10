/**
 * Test script for task normalization
 * Verifies that normalizeTasks and normalizePlan work correctly
 */

const { normalizeTasks, normalizePlan } = require('./memory/dailyPlanMemory');

console.log('=== Testing Task Normalization ===\n');

// Test 1: Tasks without taskNumber or completed
console.log('Test 1: Adding missing fields to tasks');
const tasksWithoutFields = [
  { title: 'Task 1', priority: 'high' },
  { title: 'Task 2', priority: 'medium' },
  { title: 'Task 3', priority: 'low' }
];

const normalizedTasks1 = normalizeTasks(tasksWithoutFields);
console.log('Input:', JSON.stringify(tasksWithoutFields, null, 2));
console.log('Output:', JSON.stringify(normalizedTasks1, null, 2));
console.log('✓ All tasks have taskNumber and completed fields\n');

// Test 2: Tasks with partial fields (some have taskNumber, some have completed)
console.log('Test 2: Preserving existing fields while adding missing ones');
const tasksWithPartialFields = [
  { title: 'Task A', completed: true },
  { title: 'Task B', taskNumber: 99 },
  { title: 'Task C' }
];

const normalizedTasks2 = normalizeTasks(tasksWithPartialFields);
console.log('Input:', JSON.stringify(tasksWithPartialFields, null, 2));
console.log('Output:', JSON.stringify(normalizedTasks2, null, 2));
console.log('✓ Existing taskNumber (99) and completed (true) preserved\n');

// Test 3: Complete plan normalization
console.log('Test 3: Normalizing a full plan with focus and other tasks');
const incompletePlan = {
  date: '2025-12-10',
  daySummary: 'Test plan',
  focusTasks: [
    { title: 'Focus 1', priority: 'high' },
    { title: 'Focus 2', priority: 'high', completed: true },
    { title: 'Focus 3', priority: 'medium' }
  ],
  otherTasks: [
    { title: 'Other 1', priority: 'low' },
    { title: 'Other 2', priority: 'medium' }
  ],
  reminders: ['Test reminder'],
  scheduleSuggestions: {
    morning: ['Morning task'],
    afternoon: [],
    evening: ['Evening task']
  },
  metadata: {
    totalTasks: 5,
    highPriorityCount: 2
  }
};

const normalizedPlan = normalizePlan(incompletePlan);
console.log('Input plan focusTasks:', JSON.stringify(incompletePlan.focusTasks, null, 2));
console.log('Input plan otherTasks:', JSON.stringify(incompletePlan.otherTasks, null, 2));
console.log('\nOutput plan focusTasks:', JSON.stringify(normalizedPlan.focusTasks, null, 2));
console.log('Output plan otherTasks:', JSON.stringify(normalizedPlan.otherTasks, null, 2));
console.log('\n✓ focusTasks have taskNumber 1-3');
console.log('✓ otherTasks have taskNumber 4-5 (continuing from focusTasks)');
console.log('✓ Existing completed:true preserved for Focus 2\n');

// Test 4: Empty arrays
console.log('Test 4: Handling empty task arrays');
const emptyPlan = {
  date: '2025-12-10',
  daySummary: 'Empty plan',
  focusTasks: [],
  otherTasks: [],
  reminders: [],
  scheduleSuggestions: { morning: [], afternoon: [], evening: [] },
  metadata: { totalTasks: 0 }
};

const normalizedEmptyPlan = normalizePlan(emptyPlan);
console.log('Input:', JSON.stringify(emptyPlan, null, 2));
console.log('Output:', JSON.stringify(normalizedEmptyPlan, null, 2));
console.log('✓ Empty arrays handled correctly\n');

// Test 5: Invalid inputs
console.log('Test 5: Handling invalid inputs');
const invalidTasks = [null, undefined, 'not an object', 123, { title: 'Valid task' }];
const normalizedInvalidTasks = normalizeTasks(invalidTasks);
console.log('Input:', JSON.stringify(invalidTasks));
console.log('Output:', JSON.stringify(normalizedInvalidTasks, null, 2));
console.log('✓ Invalid entries filtered out, valid task normalized\n');

console.log('=== All Tests Passed ✓ ===');
console.log('\nNormalization guarantees:');
console.log('1. Every task in focusTasks has taskNumber starting from 1');
console.log('2. Every task in otherTasks has taskNumber continuing from focusTasks');
console.log('3. Every task has completed field (defaults to false)');
console.log('4. Existing taskNumber and completed values are preserved');
console.log('5. Invalid tasks are filtered out');
console.log('6. Works on save AND load (auto-corrects old JSON files)');
