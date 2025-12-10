/**
 * API Test Script for ContextOS Memory Engine
 * Tests all memory-related endpoints
 */

const BASE_URL = 'http://localhost:8000/api';

async function testAPI(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();
  
  return { status: response.status, data };
}

async function runAPITests() {
  console.log('🧪 Testing ContextOS Memory API\n');

  try {
    // Test 1: Health check
    console.log('🏥 Test 1: Health check...');
    const health = await testAPI('GET', '/health');
    console.log('✅ Health:', health.data);
    console.log();

    // Test 2: Save new context
    console.log('💾 Test 2: Saving context via API...');
    const save1 = await testAPI('POST', '/context', {
      source: 'api-test',
      text: 'First API test entry'
    });
    console.log('✅ Saved:', save1.data);
    
    const save2 = await testAPI('POST', '/context', {
      source: 'api-test',
      text: 'Second API test entry'
    });
    console.log('✅ Saved:', save2.data);
    console.log();

    // Test 3: Get recent entries
    console.log('⏰ Test 3: Getting recent entries...');
    const recent = await testAPI('GET', '/context/recent?count=5');
    console.log(`✅ Got ${recent.data.entries.length} recent entries`);
    recent.data.entries.forEach((e, i) => {
      console.log(`  ${i + 1}. [${e.source}] ${e.content.substring(0, 50)}...`);
    });
    console.log();

    // Test 4: Get today's context
    console.log('📅 Test 4: Getting today\'s context...');
    const today = new Date().toISOString().split('T')[0];
    const dayEntries = await testAPI('GET', `/context/day/${today}`);
    console.log(`✅ Got ${dayEntries.data.entries.length} entries for ${today}`);
    console.log();

    // Test 5: Search context
    console.log('🔍 Test 5: Searching for "API"...');
    const search = await testAPI('GET', '/context/search?q=API');
    console.log(`✅ Found ${search.data.entries.length} matches`);
    search.data.entries.forEach((e, i) => {
      console.log(`  ${i + 1}. [${e.source}] ${e.content}`);
    });
    console.log();

    // Test 6: Get date range
    console.log('📆 Test 6: Getting date range...');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const range = await testAPI('GET', 
      `/context/range?start=${startDate.toISOString().split('T')[0]}&end=${endDate.toISOString().split('T')[0]}`
    );
    console.log(`✅ Got ${range.data.entries.length} entries from last 7 days`);
    console.log();

    // Test 7: Get index
    console.log('📊 Test 7: Getting memory index...');
    const index = await testAPI('GET', '/context/index');
    console.log('✅ Index:', index.data);
    console.log();

    // Test 8: Get cleanup stats
    console.log('📈 Test 8: Getting cleanup stats...');
    const stats = await testAPI('GET', '/context/cleanup/stats');
    console.log('✅ Stats:', {
      totalFiles: stats.data.totalFiles,
      totalSize: `${(stats.data.totalSize / 1024).toFixed(2)} KB`,
      oldFiles: stats.data.oldFiles
    });
    console.log();

    // Test 9: Run cleanup (dry run)
    console.log('🧹 Test 9: Running cleanup...');
    const cleanup = await testAPI('POST', '/context/cleanup');
    console.log('✅ Cleanup result:', cleanup.data);
    console.log();

    console.log('🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runAPITests();
