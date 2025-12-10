/**
 * Daily Planner Engine - Mission 8.1
 * 
 * Generates intelligent daily plans from processed context entries.
 * Uses LLM to prioritize tasks, suggest schedule, and create reminders.
 */

const { loadProcessedDay } = require('../memory/processedMemory');
const { generate } = require('../lib/llm');
const { saveDailyPlan, normalizePlan: normalizeFullPlan } = require('../memory/dailyPlanMemory');

/**
 * Generates a daily plan from processed context entries
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Daily plan with focus tasks, schedule suggestions, and reminders
 */
async function generateDailyPlan(dateStr) {
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error('Invalid date format: expected YYYY-MM-DD');
  }

  try {
    // Load all processed entries for the day
    const entries = await loadProcessedDay(dateStr);
    
    // Collect all tasks from all entries
    const allTasks = entries.flatMap(e => e.tasks || []);
    
    console.log(`[Planner] Loaded ${allTasks.length} tasks for ${dateStr}`);
    
    // Deduplicate tasks by creating a unique key from title-dueDate-priority-source
    const seenKeys = new Set();
    const uniqueTasks = [];
    
    for (const task of allTasks) {
      // Create a unique key for deduplication
      const key = `${task.title || ''}-${task.dueDate || ''}-${task.priority || ''}-${task.source || ''}`;
      
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        uniqueTasks.push(task);
      }
    }
    
    const duplicatesRemoved = allTasks.length - uniqueTasks.length;
    if (duplicatesRemoved > 0) {
      console.log(`[Planner] Deduplicated ${duplicatesRemoved} duplicate tasks (${uniqueTasks.length} unique tasks remaining)`);
    }
    
    // Limit tasks to prevent JSON overflow (max 20 tasks for LLM processing)
    const MAX_TASKS_FOR_LLM = 20;
    let tasksToProcess = uniqueTasks;
    
    if (uniqueTasks.length > MAX_TASKS_FOR_LLM) {
      console.log(`[Planner] Limiting to ${MAX_TASKS_FOR_LLM} highest priority tasks (from ${uniqueTasks.length} total)`);
      
      // Sort by priority (high > medium > low) and due date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      tasksToProcess = uniqueTasks
        .sort((a, b) => {
          const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          if (priorityDiff !== 0) return priorityDiff;
          
          // Sort by due date (earlier first)
          if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;
          return 0;
        })
        .slice(0, MAX_TASKS_FOR_LLM);
    }
    
    // If no tasks, return default plan
    if (tasksToProcess.length === 0) {
      return {
        date: dateStr,
        daySummary: "No actionable tasks found for this day.",
        focusTasks: [],
        otherTasks: [],
        reminders: [],
        scheduleSuggestions: {
          morning: [],
          afternoon: [],
          evening: []
        },
        metadata: {
          totalTasks: 0,
          highPriorityCount: 0
        }
      };
    }

    // Build prompt for LLM with deduplicated tasks
    const prompt = buildPlanningPrompt(dateStr, tasksToProcess);
    
    // Generate plan with LLM
    let planJson;
    try {
      const response = await generate(prompt);
      const responseText = typeof response === 'string' ? response : response.text;
      
      // Clean response (remove markdown code blocks if present)
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }
      
      // First attempt: Parse JSON
      try {
        planJson = JSON.parse(cleanedResponse);
      } catch (firstParseError) {
        console.warn('[Planner] Initial JSON parse failed, attempting repair...');
        console.warn('[Planner] Parse error:', firstParseError.message);
        
        // Second attempt: Ask LLM to repair the JSON
        const repairPrompt = `Repair the following invalid JSON. Return ONLY valid JSON with no markdown, no code blocks, no explanations.

INVALID JSON:
${cleanedResponse}

REPAIRED JSON (valid JSON only):`;

        try {
          const repairResponse = await generate(repairPrompt);
          const repairText = typeof repairResponse === 'string' ? repairResponse : repairResponse.text;
          
          // Clean repair response
          let cleanedRepair = repairText.trim();
          if (cleanedRepair.startsWith('```json')) {
            cleanedRepair = cleanedRepair.replace(/^```json\s*/, '').replace(/```\s*$/, '');
          } else if (cleanedRepair.startsWith('```')) {
            cleanedRepair = cleanedRepair.replace(/^```\s*/, '').replace(/```\s*$/, '');
          }
          
          // Try parsing repaired JSON
          planJson = JSON.parse(cleanedRepair);
          console.log('[Planner] JSON repair successful');
          
        } catch (repairError) {
          console.error('[Planner] JSON repair failed:', repairError.message);
          throw new Error('JSON repair failed after second attempt');
        }
      }
      
    } catch (parseError) {
      console.error('[Planner] Failed to parse LLM response after all attempts:', parseError.message);
      
      // Fallback to basic plan (normalization will add taskNumber and completed)
      const highPriorityCount = tasksToProcess.filter(t => t.priority === 'high').length;
      
      const fallbackPlan = {
        date: dateStr,
        daySummary: "LLM failed to generate a detailed plan. Showing a basic fallback.",
        focusTasks: tasksToProcess.slice(0, 3),
        otherTasks: tasksToProcess.slice(3),
        reminders: ["Check your task list", "Review priorities"],
        scheduleSuggestions: {
          morning: ["Review daily tasks"],
          afternoon: ["Work on high-priority items"],
          evening: ["Prepare for tomorrow"]
        },
        metadata: {
          totalTasks: tasksToProcess.length,
          highPriorityCount
        }
      };
      
      // Apply full normalization to fallback plan
      return normalizeFullPlan(fallbackPlan);
    }

    // Ensure the plan has the correct structure
    let plan = normalizePlan(dateStr, planJson, tasksToProcess);
    
    // Apply full normalization from dailyPlanMemory (ensures taskNumber and completed)
    plan = normalizeFullPlan(plan);
    
    console.log(`[Planner] Generated daily plan for ${dateStr}`);
    console.log(`[Planner] Focus tasks: ${plan.focusTasks.length}, Other tasks: ${plan.otherTasks.length}`);
    
    // Save the plan to persistent storage (will be normalized again on save)
    try {
      await saveDailyPlan(dateStr, plan);
    } catch (saveError) {
      console.warn(`[Planner] Failed to save plan, but continuing:`, saveError.message);
      // Don't throw - plan generation succeeded even if save failed
    }
    
    return plan;

  } catch (error) {
    console.error(`[Planner] Error generating plan for ${dateStr}:`, error.message);
    throw error;
  }
}

/**
 * Builds the LLM prompt for daily planning
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @param {Array} tasks - Array of task objects
 * @returns {string} Formatted prompt for LLM
 */
function buildPlanningPrompt(dateStr, tasks) {
  // Create a compact task list (one line per task)
  const taskList = tasks.map((t, i) => 
    `${i + 1}. ${t.title} | due:${t.dueDate || 'none'} | priority:${t.priority || 'low'} | source:${t.source || 'unknown'}`
  ).join('\n');
  
  return `You are a daily planning assistant. Analyze these tasks and create a daily plan.

DATE: ${dateStr}

TASKS (${tasks.length} total):
${taskList}

CRITICAL REQUIREMENTS:
1. Output ONLY valid JSON - NO markdown, NO code blocks, NO commentary, NO surrounding text
2. Keep ALL strings EXTREMELY SHORT (task titles under 50 chars, descriptions under 100 chars)
3. Total JSON output MUST be under 2000 characters - use abbreviations if needed
4. In scheduleSuggestions: use ONLY short task titles (5-8 words max), NOT full objects
5. Every JSON key must have double quotes
6. Ensure all brackets and braces are properly closed
7. If tasks list is long, summarize similar tasks into one line

OUTPUT STRUCTURE - Return this EXACT format:
{
  "daySummary": "One sentence about today's focus",
  "focusTasks": [1, 2, 3],
  "otherTasks": [4, 5, 6, 7],
  "reminders": ["Reminder 1", "Reminder 2"],
  "scheduleSuggestions": {
    "morning": ["Task 1", "Task 2"],
    "afternoon": ["Task 3"],
    "evening": ["Task 4"]
  }
}

RULES:
1. focusTasks: Array of task NUMBERS (e.g., [1, 2, 3]) - pick 3-5 highest priority
2. otherTasks: Array of remaining task NUMBERS
3. scheduleSuggestions: Use SHORTENED task titles (under 50 chars each)
4. reminders: 3-5 brief action items
5. ALL tasks must appear in either focusTasks or otherTasks (use their numbers)
6. Keep total JSON under 1000 characters

PRIORITIZE: high priority > urgent due dates > status=todo

OUTPUT (pure JSON, no markdown, no explanations):`;
}

/**
 * Normalizes and validates the plan structure from LLM response
 * Note: This function maps task numbers to objects. The normalizeFullPlan from
 * dailyPlanMemory will then ensure all tasks have taskNumber and completed fields.
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @param {Object} planJson - Raw JSON from LLM
 * @param {Array} allTasks - Original tasks array
 * @returns {Object} Normalized plan object
 */
function normalizePlan(dateStr, planJson, allTasks) {
  // Convert task numbers to actual task objects
  const focusTaskNumbers = Array.isArray(planJson.focusTasks) ? planJson.focusTasks : [];
  const otherTaskNumbers = Array.isArray(planJson.otherTasks) ? planJson.otherTasks : [];
  
  // Map numbers to task objects (1-indexed in prompt, 0-indexed in array)
  const focusTasks = focusTaskNumbers
    .filter(num => typeof num === 'number' && num >= 1 && num <= allTasks.length)
    .map(num => allTasks[num - 1])
    .filter(Boolean);
    
  const otherTasks = otherTaskNumbers
    .filter(num => typeof num === 'number' && num >= 1 && num <= allTasks.length)
    .map(num => allTasks[num - 1])
    .filter(Boolean);
  
  // If LLM didn't categorize all tasks, add missing ones to otherTasks
  const categorizedIndices = new Set([...focusTaskNumbers, ...otherTaskNumbers]);
  const missingTasks = allTasks.filter((_, idx) => !categorizedIndices.has(idx + 1));
  
  const plan = {
    date: dateStr,
    daySummary: planJson.daySummary || "Daily plan generated",
    focusTasks: focusTasks.length > 0 ? focusTasks : allTasks.slice(0, 3),
    otherTasks: [...otherTasks, ...missingTasks],
    reminders: Array.isArray(planJson.reminders) ? planJson.reminders : [],
    scheduleSuggestions: {
      morning: [],
      afternoon: [],
      evening: []
    },
    metadata: {
      totalTasks: allTasks.length,
      highPriorityCount: allTasks.filter(t => t.priority === 'high').length
    }
  };

  // Normalize scheduleSuggestions
  if (planJson.scheduleSuggestions && typeof planJson.scheduleSuggestions === 'object') {
    plan.scheduleSuggestions.morning = Array.isArray(planJson.scheduleSuggestions.morning) 
      ? planJson.scheduleSuggestions.morning 
      : [];
    plan.scheduleSuggestions.afternoon = Array.isArray(planJson.scheduleSuggestions.afternoon) 
      ? planJson.scheduleSuggestions.afternoon 
      : [];
    plan.scheduleSuggestions.evening = Array.isArray(planJson.scheduleSuggestions.evening) 
      ? planJson.scheduleSuggestions.evening 
      : [];
  }

  return plan;
}

module.exports = {
  generateDailyPlan
};
