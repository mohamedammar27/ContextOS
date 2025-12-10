/**
 * Chatbot API with Daily Plan Memory Access
 * Persistent conversation with access to all task history
 */

const fs = require('fs').promises;
const path = require('path');
const { generate } = require('../lib/llm');

const CHAT_FILE = path.join(__dirname, '../memory/chat-history/chat.json');
const DAILY_PLAN_DIR = path.join(__dirname, '../memory/daily-plan');

/**
 * Load chat history
 */
async function loadChatHistory() {
  try {
    const data = await fs.readFile(CHAT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('[Chatbot] No chat history found, creating new');
    return { messages: [] };
  }
}

/**
 * Save chat history
 */
async function saveChatHistory(history) {
  await fs.writeFile(CHAT_FILE, JSON.stringify(history, null, 2), 'utf8');
}

/**
 * Load all daily plans
 */
async function loadAllDailyPlans() {
  try {
    const files = await fs.readdir(DAILY_PLAN_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const allPlans = [];
    for (const file of jsonFiles) {
      const filePath = path.join(DAILY_PLAN_DIR, file);
      const content = await fs.readFile(filePath, 'utf8');
      const plan = JSON.parse(content);
      allPlans.push({
        date: file.replace('.json', ''),
        ...plan
      });
    }
    
    // Sort by date (most recent first)
    allPlans.sort((a, b) => b.date.localeCompare(a.date));
    
    return allPlans;
  } catch (error) {
    console.error('[Chatbot] Error loading daily plans:', error.message);
    return [];
  }
}

/**
 * Build system prompt with memory context
 */
function buildSystemPrompt(dailyPlans) {
  const recentPlans = dailyPlans.slice(0, 7); // Last 7 days
  
  let memoryContext = 'DAILY PLAN MEMORY (Last 7 days):\n\n';
  
  for (const plan of recentPlans) {
    memoryContext += `=== ${plan.date} ===\n`;
    memoryContext += `Summary: ${plan.daySummary || 'No summary'}\n`;
    
    if (plan.focusTasks && plan.focusTasks.length > 0) {
      memoryContext += `Focus Tasks:\n`;
      plan.focusTasks.forEach(task => {
        const status = task.completed ? '✓' : '○';
        memoryContext += `  ${status} ${task.title}\n`;
      });
    }
    
    if (plan.otherTasks && plan.otherTasks.length > 0) {
      memoryContext += `Other Tasks: ${plan.otherTasks.length} tasks\n`;
    }
    
    memoryContext += '\n';
  }
  
  const systemPrompt = `You are ContextOS AI Assistant, a helpful personal assistant with access to the user's complete task history and daily plans.

${memoryContext}

Your capabilities:
- Answer questions about past tasks, deadlines, and completed work
- Provide insights on productivity patterns
- Help plan future work based on past behavior
- Summarize what the user has been working on
- Remind about pending tasks or upcoming deadlines

Guidelines:
- Be conversational and helpful
- Reference specific dates and tasks when relevant
- If you don't have information, say so honestly
- Keep responses concise but informative
- Use the memory context to provide personalized answers`;

  return systemPrompt;
}

/**
 * Generate chatbot response
 */
async function generateResponse(userMessage, chatHistory, dailyPlans) {
  const systemPrompt = buildSystemPrompt(dailyPlans);
  
  // Build conversation context
  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.messages.slice(-10), // Last 10 messages for context
    { role: 'user', content: userMessage }
  ];
  
  // Convert to text format for generate function
  let prompt = systemPrompt + '\n\n=== CONVERSATION ===\n';
  
  for (const msg of chatHistory.messages.slice(-10)) {
    prompt += `\n${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
  }
  
  prompt += `\nUser: ${userMessage}\nAssistant:`;
  
  try {
    console.log('[Chatbot] Generating response...');
    const response = await generate(prompt);
    
    // Handle response - generate returns an object with 'text' property
    let reply = '';
    if (typeof response === 'string') {
      reply = response;
    } else if (response && response.text) {
      reply = response.text;
    } else if (response && typeof response === 'object') {
      reply = JSON.stringify(response);
    } else {
      reply = String(response || 'No response generated');
    }
    
    return reply.trim();
  } catch (error) {
    console.error('[Chatbot] Error generating response:', error.message);
    throw error;
  }
}

/**
 * Main chatbot handler
 */
async function handleChatbot(req, res) {
  try {
    // Load history request
    if (req.query.loadHistory === 'true') {
      const history = await loadChatHistory();
      return res.json({ messages: history.messages });
    }
    
    // Chat request
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log('[Chatbot] User message:', message.substring(0, 100));
    
    // Load data
    const [chatHistory, dailyPlans] = await Promise.all([
      loadChatHistory(),
      loadAllDailyPlans()
    ]);
    
    console.log(`[Chatbot] Loaded ${chatHistory.messages.length} chat messages, ${dailyPlans.length} daily plans`);
    
    // Generate response
    const reply = await generateResponse(message, chatHistory, dailyPlans);
    
    console.log('[Chatbot] Reply generated:', reply.substring(0, 100));
    
    // Save to history
    chatHistory.messages.push(
      { role: 'user', content: message, timestamp: Date.now() },
      { role: 'assistant', content: reply, timestamp: Date.now() }
    );
    
    await saveChatHistory(chatHistory);
    
    console.log('[Chatbot] History saved');
    
    res.json({ reply });
    
  } catch (error) {
    console.error('[Chatbot] Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      message: error.message 
    });
  }
}

/**
 * Clear chat history
 */
async function clearChatHistory(req, res) {
  try {
    await saveChatHistory({ messages: [] });
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('[Chatbot] Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
}

module.exports = {
  handleChatbot,
  clearChatHistory,
  loadChatHistory,
  loadAllDailyPlans
};
