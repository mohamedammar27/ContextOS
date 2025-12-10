/**
 * Test Daily Planner API Routes
 * 
 * Tests the GET and POST endpoints for daily plan management
 */

const BASE_URL = 'http://localhost:8000';

async function testDailyPlannerAPI() {
  console.log('🧪 Testing Daily Planner API Routes\n');
  
  try {
    const testDate = '2025-12-08';
    const nonExistentDate = '2020-01-01';
    
    // Test 1: GET existing plan
    console.log('Test 1: GET /api/daily-plan?date=' + testDate);
    const getResponse1 = await fetch(`${BASE_URL}/api/daily-plan?date=${testDate}`);
    const getData1 = await getResponse1.json();
    
    if (getData1.exists) {
      console.log('✅ Found existing plan');
      console.log(`   Date: ${getData1.plan.date}`);
      console.log(`   Focus tasks: ${getData1.plan.focusTasks.length}`);
      console.log(`   Total tasks: ${getData1.plan.metadata.totalTasks}`);
    } else {
      console.log('ℹ️  No existing plan found (will generate)');
    }
    console.log();
    
    // Test 2: GET non-existent plan
    console.log('Test 2: GET /api/daily-plan?date=' + nonExistentDate);
    const getResponse2 = await fetch(`${BASE_URL}/api/daily-plan?date=${nonExistentDate}`);
    const getData2 = await getResponse2.json();
    
    if (!getData2.exists) {
      console.log('✅ Correctly returned exists: false for non-existent date');
    } else {
      console.log('❌ Unexpected: Plan exists for ' + nonExistentDate);
    }
    console.log();
    
    // Test 3: POST generate new plan
    console.log('Test 3: POST /api/daily-plan/generate?date=' + testDate);
    const postResponse = await fetch(`${BASE_URL}/api/daily-plan/generate?date=${testDate}`, {
      method: 'POST'
    });
    const postData = await postResponse.json();
    
    if (postData.ok) {
      console.log('✅ Plan generated successfully');
      console.log(`   Date: ${postData.plan.date}`);
      console.log(`   Day Summary: ${postData.plan.daySummary}`);
      console.log(`   Focus tasks: ${postData.plan.focusTasks.length}`);
      console.log(`   Other tasks: ${postData.plan.otherTasks.length}`);
      console.log(`   Reminders: ${postData.plan.reminders.length}`);
      console.log(`   Total tasks: ${postData.plan.metadata.totalTasks}`);
    } else {
      console.log('❌ Failed to generate plan:', postData.error);
    }
    console.log();
    
    // Test 4: Verify saved plan
    console.log('Test 4: Verify plan was saved (GET after POST)');
    const getResponse3 = await fetch(`${BASE_URL}/api/daily-plan?date=${testDate}`);
    const getData3 = await getResponse3.json();
    
    if (getData3.exists) {
      console.log('✅ Plan exists after generation');
      console.log(`   Verified focus tasks: ${getData3.plan.focusTasks.length}`);
    } else {
      console.log('❌ Plan not found after generation');
    }
    console.log();
    
    // Test 5: Invalid date format
    console.log('Test 5: GET with invalid date format');
    const getResponse4 = await fetch(`${BASE_URL}/api/daily-plan?date=invalid-date`);
    const getData4 = await getResponse4.json();
    
    if (getData4.error && getData4.error.includes('Invalid date format')) {
      console.log('✅ Correctly rejected invalid date format');
    } else {
      console.log('❌ Should have rejected invalid date format');
    }
    console.log();
    
    // Test 6: Missing date parameter
    console.log('Test 6: GET without date parameter');
    const getResponse5 = await fetch(`${BASE_URL}/api/daily-plan`);
    const getData5 = await getResponse5.json();
    
    if (getData5.error && getData5.error.includes('Missing required')) {
      console.log('✅ Correctly rejected missing date parameter');
    } else {
      console.log('❌ Should have rejected missing date parameter');
    }
    console.log();
    
    console.log('='.repeat(60));
    console.log('✅ All API tests completed!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Check if backend is running
async function checkBackend() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ Backend is running\n');
      return true;
    }
  } catch (error) {
    console.error('❌ Backend is not running!');
    console.error('   Please start the backend: cd backend && npm start');
    process.exit(1);
  }
}

async function main() {
  await checkBackend();
  await testDailyPlannerAPI();
}

main();
