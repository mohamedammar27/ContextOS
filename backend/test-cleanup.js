/**
 * Quick test to verify cleanup deletes old files
 */

const memory = require('./memory');

async function testCleanup() {
  console.log('🧹 Testing cleanup function...\n');

  try {
    // Check current config
    console.log('📋 Current configuration:');
    const config = await memory.getCleanupConfig();
    console.log(`   Retention: ${config.retentionDays} days\n`);

    // Get stats before cleanup
    console.log('📊 Before cleanup:');
    const statsBefore = await memory.getCleanupStats();
    console.log(`   Total files: ${statsBefore.totalFiles}`);
    console.log(`   Old files: ${statsBefore.oldFiles}`);
    console.log(`   Total size: ${(statsBefore.totalSize / 1024).toFixed(2)} KB\n`);

    // Run cleanup
    console.log('🗑️  Running cleanup...');
    const result = await memory.cleanupOldLogs();
    console.log(`\n✅ Cleanup completed!`);
    console.log(`   Deleted: ${result.deletedFiles.length} files`);
    console.log(`   Kept: ${result.keptFiles} files`);
    console.log(`   Freed: ${(result.freedSpace / 1024).toFixed(2)} KB`);
    
    if (result.deletedFiles.length > 0) {
      console.log('\n📝 Deleted files:');
      result.deletedFiles.forEach(file => {
        console.log(`   - ${file}`);
      });
    }

    // Get stats after cleanup
    console.log('\n📊 After cleanup:');
    const statsAfter = await memory.getCleanupStats();
    console.log(`   Total files: ${statsAfter.totalFiles}`);
    console.log(`   Old files: ${statsAfter.oldFiles}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testCleanup();
