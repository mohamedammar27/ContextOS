/**
 * Test Daily Plan Memory
 * 
 * Tests the daily plan storage and retrieval functions
 */

const { saveDailyPlan, loadDailyPlan, getDailyPlanPath } = require('./memory/dailyPlanMemory');

async function testDailyPlanMemory() {
  console.log('🧪 Testing Daily Plan Memory\n');
  
  try {
    const testDate = '2025-12-09';
    
    // Test 1: Create a mock plan
    console.log('📝 Test 1: Creating mock plan...');
    const mockPlan = {
      date: testDate,
      daySummary: "Test plan for memory storage",
      focusTasks: [
        { title: "Task 1", dueDate: "2025-12-10", priority: "high", source: "test" },
        { title: "Task 2", dueDate: null, priority: "medium", source: "test" }
      ],
      otherTasks: [
        { title: "Task 3", dueDate: "2025-12-15", priority: "low", source: "test" }
      ],
      reminders: ["Test reminder 1", "Test reminder 2"],
      scheduleSuggestions: {
        morning: ["Task 1"],
        afternoon: ["Task 2"],
        evening: ["Task 3"]
      },
      metadata: {
        totalTasks: 3,
        highPriorityCount: 1
      }
    };
    
    // Test 2: Save the plan
    console.log('\n💾 Test 2: Saving plan...');
    await saveDailyPlan(testDate, mockPlan);
    console.log('✅ Plan saved successfully');
    
    // Test 3: Get file path
    console.log('\n📂 Test 3: Getting file path...');
    const filePath = getDailyPlanPath(testDate);
    console.log(`   Path: ${filePath}`);
    console.log('✅ File path retrieved');
    
    // Test 4: Load the plan
    console.log('\n📖 Test 4: Loading plan...');
    const loadedPlan = await loadDailyPlan(testDate);
    
    if (!loadedPlan) {
      throw new Error('Failed to load plan');
    }
    
    console.log('✅ Plan loaded successfully');
    console.log(`   Date: ${loadedPlan.date}`);
    console.log(`   Summary: ${loadedPlan.daySummary}`);
    console.log(`   Focus Tasks: ${loadedPlan.focusTasks.length}`);
    console.log(`   Other Tasks: ${loadedPlan.otherTasks.length}`);
    console.log(`   Reminders: ${loadedPlan.reminders.length}`);
    
    // Test 5: Verify data integrity
    console.log('\n🔍 Test 5: Verifying data integrity...');
    if (loadedPlan.date !== mockPlan.date) {
      throw new Error('Date mismatch');
    }
    if (loadedPlan.focusTasks.length !== mockPlan.focusTasks.length) {
      throw new Error('Focus tasks count mismatch');
    }
    if (loadedPlan.otherTasks.length !== mockPlan.otherTasks.length) {
      throw new Error('Other tasks count mismatch');
    }
    console.log('✅ Data integrity verified');
    
    // Test 6: Load non-existent plan
    console.log('\n📖 Test 6: Loading non-existent plan...');
    const nonExistent = await loadDailyPlan('2020-01-01');
    if (nonExistent === null) {
      console.log('✅ Correctly returned null for non-existent plan');
    } else {
      throw new Error('Should have returned null');
    }
    
    // Test 7: Invalid date format
    console.log('\n⚠️  Test 7: Testing invalid date format...');
    try {
      await saveDailyPlan('invalid-date', mockPlan);
      throw new Error('Should have thrown error for invalid date');
    } catch (error) {
      if (error.message.includes('Invalid date format')) {
        console.log('✅ Correctly rejected invalid date format');
      } else {
        throw error;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests passed!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testDailyPlanMemory();
