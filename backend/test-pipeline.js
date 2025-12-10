/**
 * Test the complete parsing pipeline
 */

async function testPipeline() {
  console.log('🧪 Testing ContextOS Parsing Pipeline\n');

  const testData = {
    source: 'test-pipeline',
    content: 'Meeting notes: Discuss Q4 roadmap with Sarah. Complete the marketing proposal by Friday. Deploy the new feature to production. Contact John at Microsoft about the partnership.'
  };

  try {
    console.log('📤 Sending POST request to /api/context...\n');
    
    const response = await fetch('http://localhost:8000/api/context', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('📨 Response:', JSON.stringify(result, null, 2));
    
    if (result.ok && result.parsed) {
      console.log('\n✅ Pipeline test successful!');
      console.log('\n📁 Check these files:');
      console.log('   - backend/memory/logs/2025-12-08.json (raw context)');
      console.log('   - backend/memory/processed/2025-12-08.json (parsed data)');
    } else if (result.ignored) {
      console.log('\n⚠️  Content was marked as irrelevant');
    } else {
      console.log('\n❌ Pipeline test failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the backend is running: npm start');
  }
}

testPipeline();
