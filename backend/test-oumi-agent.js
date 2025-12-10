/**
 * Test the Oumi Parser Agent
 * Run with: node test-oumi-agent.js
 */

const { parsingAgent } = require('./oumi/parserAgent');

async function testOumiAgent() {
  console.log('🤖 Testing Oumi Parser Agent\n');

  const testContent = `
Team Meeting Notes - December 9, 2025

Attendees: Sarah Johnson, Mike Chen, Alex Rodriguez

Action Items:
1. Sarah - Complete Q4 budget proposal by Friday
2. Mike - Deploy authentication service to production
3. Alex - Schedule client demo with Microsoft team

Discussion Topics:
- Reviewed progress on Project Phoenix
- Discussed integration with Salesforce API
- Decided to use React and TypeScript for frontend

Next meeting: December 16, 2025
  `.trim();

  try {
    console.log('[Oumi] Invoking Parser Agent...\n');

    const result = await parsingAgent.run({
      content: testContent,
      source: 'oumi-test',
      timestamp: Date.now()
    });

    console.log('✅ Agent completed successfully!\n');
    
    // Display results
    console.log('📝 Summary:');
    console.log(`   ${result.summary}\n`);
    
    console.log('📋 Tasks Found:', result.tasks.length);
    result.tasks.forEach((task, i) => {
      console.log(`   ${i + 1}. [${task.priority}] ${task.title}`);
      if (task.dueDate) {
        console.log(`      Due: ${task.dueDate}`);
      }
    });
    
    console.log('\n👥 Entities:');
    console.log(`   People: ${result.entities.people.join(', ')}`);
    console.log(`   Companies: ${result.entities.companies.join(', ')}`);
    console.log(`   Projects: ${result.entities.projects.join(', ')}`);
    console.log(`   Tools: ${result.entities.tools.join(', ')}`);
    
    console.log('\n🧠 Agent Reasoning:');
    console.log(`   Steps executed: ${result.agentThoughts.steps.length}`);
    console.log(`   Execution time: ${result.agentThoughts.totalExecutionTime}`);
    console.log(`   Conclusion: ${result.agentThoughts.conclusion}`);
    
    console.log('\n📊 Reasoning Trace:');
    result.agentThoughts.steps.forEach(step => {
      console.log(`   Step ${step.step}: ${step.action}`);
      console.log(`   💭 ${step.thought}`);
      if (step.result) {
        console.log(`   ✓ Result: ${step.result}`);
      }
      console.log('');
    });

    // Display agent info
    console.log('ℹ️  Agent Information:');
    const info = parsingAgent.getInfo();
    console.log(`   Name: ${info.name}`);
    console.log(`   Version: ${info.version}`);
    console.log(`   Capabilities: ${info.capabilities.join(', ')}`);

  } catch (error) {
    console.error('❌ Agent test failed:', error);
    process.exit(1);
  }
}

testOumiAgent();
