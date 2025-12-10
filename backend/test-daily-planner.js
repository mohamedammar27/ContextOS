/**
 * Test Daily Planner Engine
 * 
 * This script tests the generateDailyPlan function with real processed data
 */

const { generateDailyPlan } = require('./daily/dailyPlanner');

function displayPlanSummary(plan) {
  console.log('✅ Daily Plan Generated!\n');
  console.log('📋 DAILY PLAN SUMMARY');
  console.log('='.repeat(60));
  console.log(`Date: ${plan.date}`);
  console.log(`\nDay Summary:\n${plan.daySummary}`);
    
    console.log(`\n🎯 Focus Tasks (${plan.focusTasks.length}):`);
    if (plan.focusTasks.length === 0) {
      console.log('   (none)');
    } else {
      plan.focusTasks.forEach((task, i) => {
        console.log(`   ${i + 1}. ${task.title}`);
        if (task.dueDate) console.log(`      Due: ${task.dueDate}`);
        if (task.priority) console.log(`      Priority: ${task.priority}`);
        console.log(`      Source: ${task.source || 'unknown'}`);
      });
    }
    
    console.log(`\n📝 Other Tasks (${plan.otherTasks.length}):`);
    if (plan.otherTasks.length === 0) {
      console.log('   (none)');
    } else {
      plan.otherTasks.slice(0, 5).forEach((task, i) => {
        console.log(`   ${i + 1}. ${task.title}`);
      });
      if (plan.otherTasks.length > 5) {
        console.log(`   ... and ${plan.otherTasks.length - 5} more`);
      }
    }
    
    console.log(`\n🔔 Reminders (${plan.reminders.length}):`);
    if (plan.reminders.length === 0) {
      console.log('   (none)');
    } else {
      plan.reminders.forEach((reminder, i) => {
        console.log(`   ${i + 1}. ${reminder}`);
      });
    }
    
    console.log('\n🕐 Schedule Suggestions:');
    console.log(`   Morning (${plan.scheduleSuggestions.morning.length}):`);
    plan.scheduleSuggestions.morning.forEach(item => {
      console.log(`      • ${item}`);
    });
    
    console.log(`   Afternoon (${plan.scheduleSuggestions.afternoon.length}):`);
    plan.scheduleSuggestions.afternoon.forEach(item => {
      console.log(`      • ${item}`);
    });
    
    console.log(`   Evening (${plan.scheduleSuggestions.evening.length}):`);
    plan.scheduleSuggestions.evening.forEach(item => {
      console.log(`      • ${item}`);
    });
    
    console.log('\n📊 Metadata:');
  console.log(`   Total Tasks: ${plan.metadata.totalTasks}`);
  console.log(`   High Priority: ${plan.metadata.highPriorityCount}`);
}

async function testDailyPlanner() {
  console.log('🧪 Testing Daily Planner Engine\n');
  
  try {
    // Test with multiple dates that have processed data
    const datesToTest = ['2025-12-08', '2025-12-09'];
    
    for (const dateStr of datesToTest) {
      console.log(`📅 Generating plan for: ${dateStr}\n`);
      
      const plan = await generateDailyPlan(dateStr);
      displayPlanSummary(plan);
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ Plan saved to memory/daily-plan/');
      console.log('='.repeat(60) + '\n\n');
    }
    
    // Test with a date that has no data
    console.log('🧪 Testing with date that has no data...');
    const emptyDate = '2020-01-01';
    const emptyPlan = await generateDailyPlan(emptyDate);
    console.log(`✅ Empty date handling: ${emptyPlan.daySummary}\n`);
    
    console.log('='.repeat(60));
    console.log('✅ All tests completed successfully!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testDailyPlanner();
