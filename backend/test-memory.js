/**
 * Test script for ContextOS Memory Engine
 * Run with: node test-memory.js
 */

const memory = require('./memory');

async function runTests() {
  console.log('🧪 Testing ContextOS Memory Engine\n');

  try {
    // Test 1: Save context entries
    console.log('📝 Test 1: Saving context entries...');
    await memory.appendContext('github', 'User opened PR #123: Add memory system');
    await memory.appendContext('slack', 'Team meeting scheduled for 3pm');
    await memory.appendContext('discord', 'New feature request: Dark mode');
    await memory.appendContext('github', 'PR #123 merged successfully');
    console.log('✅ Saved 4 entries\n');

    // Test 2: Get index
    console.log('📊 Test 2: Getting index...');
    const index = await memory.getIndex();
    console.log('Index:', JSON.stringify(index, null, 2));
    console.log('✅ Index retrieved\n');

    // Test 3: Load today's entries
    console.log('📖 Test 3: Loading today\'s entries...');
    const today = new Date();
    const todayEntries = await memory.loadDay(today);
    console.log(`Found ${todayEntries.length} entries for today`);
    todayEntries.forEach((entry, i) => {
      console.log(`  ${i + 1}. [${entry.source}] ${entry.content.substring(0, 50)}...`);
    });
    console.log('✅ Loaded today\'s entries\n');

    // Test 4: Load by source
    console.log('🔍 Test 4: Loading GitHub entries...');
    const githubEntries = await memory.loadBySource('github');
    console.log(`Found ${githubEntries.length} GitHub entries`);
    githubEntries.forEach((entry, i) => {
      console.log(`  ${i + 1}. ${entry.content}`);
    });
    console.log('✅ Loaded by source\n');

    // Test 5: Search context
    console.log('🔎 Test 5: Searching for "PR"...');
    const searchResults = await memory.searchContext('PR');
    console.log(`Found ${searchResults.length} matches`);
    searchResults.forEach((entry, i) => {
      console.log(`  ${i + 1}. [${entry.source}] ${entry.content}`);
    });
    console.log('✅ Search completed\n');

    // Test 6: Get recent entries
    console.log('⏰ Test 6: Getting recent entries...');
    const recentEntries = await memory.loadRecent(3);
    console.log(`Got ${recentEntries.length} most recent entries`);
    recentEntries.forEach((entry, i) => {
      console.log(`  ${i + 1}. [${entry.source}] ${entry.content.substring(0, 50)}...`);
    });
    console.log('✅ Recent entries loaded\n');

    // Test 7: Get cleanup config
    console.log('⚙️  Test 7: Getting cleanup configuration...');
    const config = await memory.getCleanupConfig();
    console.log('Config:', config);
    console.log('✅ Config retrieved\n');

    // Test 8: Get cleanup stats
    console.log('📈 Test 8: Getting cleanup statistics...');
    const stats = await memory.getCleanupStats();
    console.log('Stats:', {
      totalFiles: stats.totalFiles,
      totalSize: `${(stats.totalSize / 1024).toFixed(2)} KB`,
      oldFiles: stats.oldFiles,
      retentionDays: stats.retentionDays
    });
    console.log('✅ Stats retrieved\n');

    // Test 9: Rebuild index
    console.log('🔧 Test 9: Rebuilding index...');
    const rebuiltIndex = await memory.rebuildIndex();
    console.log('Rebuilt index:', JSON.stringify(rebuiltIndex, null, 2));
    console.log('✅ Index rebuilt\n');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📁 Check backend/memory/logs/ for generated files');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
runTests();
