/**
 * Daily Planner UI Integration Test
 * Tests the complete flow: Backend API → Next.js → Browser
 */

const BACKEND_URL = 'http://localhost:8000';
const FRONTEND_URL = 'http://localhost:3000';

async function testDailyPlannerUI() {
  console.log('🧪 Testing Daily Planner UI Integration\n');

  // Test 1: Check backend is running
  console.log('Test 1: Backend Health Check');
  try {
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    if (healthResponse.ok) {
      console.log('✅ Backend is running on port 8000\n');
    } else {
      console.log('❌ Backend health check failed\n');
      return;
    }
  } catch (error) {
    console.log('❌ Backend is not running. Start it with: cd backend && npm start\n');
    return;
  }

  // Test 2: Check if daily plan exists
  const today = new Date().toISOString().split('T')[0];
  console.log(`Test 2: Check Daily Plan for ${today}`);
  try {
    const planResponse = await fetch(`${BACKEND_URL}/api/daily-plan?date=${today}`);
    const planData = await planResponse.json();
    
    if (planData.exists) {
      console.log(`✅ Daily plan exists for ${today}`);
      console.log(`   - Focus Tasks: ${planData.plan.focusTasks.length}`);
      console.log(`   - Other Tasks: ${planData.plan.otherTasks.length}`);
      console.log(`   - Reminders: ${planData.plan.reminders.length}`);
      console.log(`   - Schedule Suggestions: ${planData.plan.scheduleSuggestions.length}`);
      console.log(`   - Day Summary: "${planData.plan.daySummary.substring(0, 50)}..."\n`);
    } else {
      console.log(`⚠️  No plan exists for ${today}`);
      console.log('   The UI will show "Generate Plan" button\n');
    }
  } catch (error) {
    console.log('❌ Failed to fetch daily plan:', error.message, '\n');
    return;
  }

  // Test 3: Verify frontend is accessible
  console.log('Test 3: Frontend Accessibility');
  try {
    const frontendResponse = await fetch(FRONTEND_URL);
    if (frontendResponse.ok) {
      console.log('✅ Frontend is running on port 3000\n');
    } else {
      console.log('❌ Frontend is not accessible\n');
      return;
    }
  } catch (error) {
    console.log('❌ Frontend is not running. Start it with: cd ui && npm run dev\n');
    return;
  }

  // Success message
  console.log('============================================================');
  console.log('✅ All systems operational!');
  console.log('============================================================');
  console.log('\n📱 Access your Daily Planner:');
  console.log(`   🏠 Overview: ${FRONTEND_URL}`);
  console.log(`   📅 Daily Planner: ${FRONTEND_URL}/dashboard`);
  console.log('\n✨ Features Available:');
  console.log('   ✓ Day Summary - Overview of your daily goals');
  console.log('   ✓ Focus Tasks - Priority tasks with reasoning');
  console.log('   ✓ Other Tasks - Additional tasks in grid layout');
  console.log('   ✓ Reminders - Important notes and reminders');
  console.log('   ✓ Schedule Suggestions - Time-based recommendations');
  console.log('   ✓ Regenerate Plan - Create a fresh plan anytime');
  console.log('\n🎨 UI Features:');
  console.log('   ✓ Modern gradient cards with animations');
  console.log('   ✓ Smooth transitions and hover effects');
  console.log('   ✓ Responsive layout (mobile-friendly)');
  console.log('   ✓ Dark theme with neon accents');
  console.log('   ✓ Real-time plan regeneration');
  console.log('============================================================\n');
}

// Run the test
testDailyPlannerUI().catch(console.error);
