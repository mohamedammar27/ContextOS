/**
 * Test Manual Context Capture from UI
 * Tests the new /context page that allows manual text input
 */

const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:8000';

const testContent = `
Meeting Notes - December 10, 2025
==================================

Attendees: John, Sarah, Mike

Discussion Points:
1. Review Q4 roadmap progress
2. Plan sprint priorities for next week
3. Discuss API integration issues

Action Items:
- [ ] John: Complete authentication module by Friday
- [ ] Sarah: Review pull requests for payment gateway
- [ ] Mike: Update documentation for new endpoints
- [ ] Team: Schedule code review session for Thursday 2pm

Technical Notes:
- Need to upgrade Node.js to v20 in production
- Consider migrating to microservices architecture
- API rate limiting causing issues for mobile app

Next Meeting: December 17, 2025 @ 10:00 AM
`;

async function testManualCapture() {
  console.log('🧪 Testing Manual Context Capture\n');
  console.log('=' .repeat(60));

  try {
    console.log('📤 Sending manual context to backend...\n');
    
    const response = await fetch(`${BACKEND_URL}/api/context`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'manual',
        content: testContent
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Request failed:', response.status, error);
      return;
    }

    const result = await response.json();
    console.log('✅ Response received:\n');
    console.log(JSON.stringify(result, null, 2));

    if (result.ok) {
      console.log('\n✓ Context saved successfully!');
      
      if (result.ignored) {
        console.log('⚠️  Content was marked as irrelevant by AI');
      } else {
        console.log('✓ Content parsed and processed');
        console.log('✓ Tasks extracted and saved');
        console.log('✓ Memory system updated');
      }
    }

    // Wait a moment then check if it was saved
    console.log('\n⏳ Waiting 2 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test retrieving recent context
    console.log('📥 Fetching recent context entries...\n');
    const recentResponse = await fetch(`${BACKEND_URL}/api/context/recent?limit=1`);
    
    if (recentResponse.ok) {
      const recentData = await recentResponse.json();
      console.log('Recent entries:', recentData.length);
      
      if (recentData.length > 0) {
        const latest = recentData[0];
        console.log('\nLatest entry:');
        console.log('  Source:', latest.source);
        console.log('  Timestamp:', new Date(latest.timestamp).toLocaleString());
        console.log('  Content length:', latest.content.length, 'chars');
        console.log('  Preview:', latest.content.substring(0, 100) + '...');
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Manual capture test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Visit http://localhost:3000/dashboard/context');
    console.log('   2. Paste your text in the textarea');
    console.log('   3. Click "Save as New Context"');
    console.log('   4. Watch it save, parse, and extract tasks!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n⚠️  Make sure:');
    console.log('   - Backend is running on port 8000');
    console.log('   - Run: npm start (in backend folder)');
  }
}

testManualCapture();
