const { generate } = require('../lib/llm');

/**
 * Analyzes context using LLM to extract structured information
 * @param {Object} params - Context parameters
 * @param {string} params.content - The text content to analyze
 * @param {string} params.source - Source of the content (e.g., "slack", "github")
 * @param {number} params.timestamp - Unix timestamp in milliseconds
 * @returns {Promise<Object>} Analyzed context with summary, tasks, entities, and metadata
 */
async function analyzeContext({ content, source, timestamp }) {
  // Validate input
  if (!source || !timestamp) {
    console.error('[Parser] Missing required parameters: source and timestamp');
    return {
      summary: "irrelevant",
      tasks: [],
      entities: { people: [], companies: [], projects: [], tools: [] },
      metadata: { source: source || 'unknown', timestamp: timestamp || Date.now(), contentType: "other" }
    };
  }

  // 1. Check if content is too short or empty
  if (!content || content.trim().length < 50) {
    console.log('[Parser] Content too short or empty, skipping LLM analysis');
    return {
      summary: "irrelevant",
      tasks: [],
      entities: { people: [], companies: [], projects: [], tools: [] },
      metadata: { source, timestamp, contentType: "other" }
    };
  }

  // Build the prompt for LLM
  const prompt = `You are a context analysis assistant. Analyze the following text and extract structured information.

TEXT TO ANALYZE:
${content}

SOURCE: ${source}
TIMESTAMP: ${timestamp}

INSTRUCTIONS:
1. Provide a brief summary (1-2 sentences)
2. Extract any tasks/todos with:
   - title: clear task description
   - dueDate: date in YYYY-MM-DD format (if mentioned, otherwise null)
   - priority: "low", "medium", or "high" (infer from urgency keywords)
   - status: always "pending"
   - source: "${source}"
3. Identify key entities:
   - people: names of people mentioned
   - companies: company or organization names
   - projects: project names or initiatives
   - tools: software tools, platforms, or technologies mentioned
4. Classify the content type as ONE of: "meeting_notes", "todo_list", "chat", "email", "article", "other"

CRITICAL RULE - DETECT IRRELEVANT CONTENT:
If the content contains NO actionable information, NO tasks, NO deadlines, NO entities, and NO useful meaning (e.g., navigation menus, boilerplate text, error messages, random snippets), respond with:
{
  "summary": "irrelevant",
  "tasks": [],
  "entities": {
    "people": [],
    "companies": [],
    "projects": [],
    "tools": []
  },
  "metadata": {
    "source": "${source}",
    "timestamp": ${timestamp},
    "contentType": "other"
  }
}

CRITICAL: Respond with ONLY valid JSON. No markdown, no code blocks, no commentary.

JSON FORMAT:
{
  "summary": "brief summary here",
  "tasks": [
    {
      "title": "task description",
      "dueDate": "2025-12-09",
      "priority": "high",
      "status": "pending",
      "source": "${source}"
    }
  ],
  "entities": {
    "people": ["name1", "name2"],
    "companies": ["company1"],
    "projects": ["project1"],
    "tools": ["tool1", "tool2"]
  },
  "metadata": {
    "source": "${source}",
    "timestamp": ${timestamp},
    "contentType": "meeting_notes"
  }
}`;

  try {
    console.log(`[Parser] Analyzing context from ${source}...`);
    
    // Call LLM
    const response = await generate(prompt);
    
    // Extract text from response object
    const responseText = typeof response === 'string' ? response : response.text;
    
    // Clean response (remove markdown code blocks if present)
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }
    
    // Parse JSON
    const parsed = JSON.parse(cleanedResponse);
    
    // Validate structure
    if (!parsed.summary || !Array.isArray(parsed.tasks) || !parsed.entities || !parsed.metadata) {
      throw new Error('Invalid JSON structure from LLM');
    }
    
    // Ensure all required entity arrays exist
    parsed.entities.people = parsed.entities.people || [];
    parsed.entities.companies = parsed.entities.companies || [];
    parsed.entities.projects = parsed.entities.projects || [];
    parsed.entities.tools = parsed.entities.tools || [];
    
    // Validate each task has required fields
    parsed.tasks = parsed.tasks.map(task => ({
      title: task.title || 'Untitled task',
      dueDate: task.dueDate || null,
      priority: ['low', 'medium', 'high'].includes(task.priority) ? task.priority : 'medium',
      status: 'pending',
      source: source
    }));
    
    // Ensure metadata has correct values
    parsed.metadata.source = source;
    parsed.metadata.timestamp = timestamp;
    parsed.metadata.contentType = ['meeting_notes', 'todo_list', 'chat', 'email', 'article', 'other'].includes(parsed.metadata.contentType) 
      ? parsed.metadata.contentType 
      : 'other';
    
    // 3. Post-validation: Check if content is truly irrelevant
    const summaryLower = parsed.summary.toLowerCase();
    if (
      parsed.summary.length < 10 || 
      (parsed.tasks.length === 0 && (summaryLower.includes('irrelevant') || summaryLower.includes('no meaningful') || summaryLower.includes('no actionable')))
    ) {
      console.log('[Parser] Detected irrelevant content from LLM response');
      return {
        summary: "irrelevant",
        tasks: [],
        entities: { people: [], companies: [], projects: [], tools: [] },
        metadata: { source, timestamp, contentType: "other" }
      };
    }
    
    console.log(`[Parser] ✅ Successfully analyzed: ${parsed.tasks.length} tasks, ${Object.values(parsed.entities).flat().length} entities`);
    
    return parsed;
    
  } catch (error) {
    console.error('[Parser] ❌ Failed to analyze context:', error.message);
    
    // Return fallback object (not an error throw)
    const fallback = {
      summary: "irrelevant",
      tasks: [],
      entities: {
        people: [],
        companies: [],
        projects: [],
        tools: []
      },
      metadata: {
        source,
        timestamp,
        contentType: "other"
      }
    };
    
    console.log('[Parser] Returning fallback object due to error');
    return fallback;
  }
}

module.exports = {
  analyzeContext
};
