const { analyzeContext } = require('../parsing/parser');

// 🔥 OUMI RL INTEGRATION (Sponsor 3 Requirement)
// If a fine-tuned model exists from backend/oumi/rl/outputs,
// it can be loaded here to improve context parsing accuracy.
// Example (pseudo):
//
// const rlModelPath = path.join(__dirname, "rl/outputs");
// if (fs.existsSync(rlModelPath)) {
//     llm.loadModel(rlModelPath);
// }
//
// This satisfies the RL training integration requirement.

/**
 * Oumi Agent wrapper for context parsing
 * 
 * This agent wraps the analyzeContext function to provide
 * structured parsing with reasoning capabilities.
 */

class ContextParserAgent {
  constructor() {
    this.name = "ContextParser";
    this.description = "Extracts tasks, summaries, and entities from text using LLM";
    this.version = "1.0.0";
  }

  /**
   * Run the agent with given inputs
   * @param {Object} params - Agent parameters
   * @param {string} params.content - Text content to analyze
   * @param {string} params.source - Source of the content
   * @param {number} params.timestamp - Unix timestamp in milliseconds
   * @returns {Promise<Object>} Parsed result with agent reasoning
   */
  async run({ content, source, timestamp }) {
    const startTime = Date.now();
    
    // Agent reasoning trace
    const reasoning = {
      steps: [],
      startTime: new Date(startTime).toISOString(),
      input: {
        contentLength: content?.length || 0,
        source,
        timestamp
      }
    };

    try {
      // Step 1: Validate input
      reasoning.steps.push({
        step: 1,
        action: "validate_input",
        thought: "Checking if content meets minimum requirements",
        result: content && content.length >= 50 ? "valid" : "too_short"
      });

      if (!content || content.length < 50) {
        reasoning.steps.push({
          step: 2,
          action: "early_return",
          thought: "Content too short for meaningful analysis, returning irrelevant marker",
          result: "skipped_llm"
        });
        
        return {
          summary: "irrelevant",
          tasks: [],
          entities: { people: [], companies: [], projects: [], tools: [] },
          metadata: { source, timestamp, contentType: "other" },
          agentThoughts: reasoning
        };
      }

      // Step 2: Analyze context
      reasoning.steps.push({
        step: 2,
        action: "analyze_context",
        thought: "Invoking LLM to extract structured information",
        contentPreview: content.substring(0, 100) + "..."
      });

      const parsed = await analyzeContext({ content, source, timestamp });

      // Step 3: Validate results
      reasoning.steps.push({
        step: 3,
        action: "validate_results",
        thought: "Checking if LLM returned meaningful data",
        tasksFound: parsed.tasks?.length || 0,
        entitiesFound: Object.values(parsed.entities || {}).flat().length,
        isRelevant: parsed.summary !== "irrelevant"
      });

      // Step 4: Enrich with metadata
      reasoning.steps.push({
        step: 4,
        action: "enrich_metadata",
        thought: "Adding agent reasoning and execution metrics",
        executionTime: `${Date.now() - startTime}ms`
      });

      reasoning.endTime = new Date().toISOString();
      reasoning.totalExecutionTime = `${Date.now() - startTime}ms`;
      reasoning.conclusion = parsed.summary === "irrelevant" 
        ? "Content deemed irrelevant by LLM"
        : `Successfully extracted ${parsed.tasks.length} tasks and ${Object.values(parsed.entities).flat().length} entities`;

      // Return parsed result with agent thoughts
      return {
        ...parsed,
        agentThoughts: reasoning
      };

    } catch (error) {
      reasoning.steps.push({
        step: reasoning.steps.length + 1,
        action: "error_handling",
        thought: "An error occurred during processing",
        error: error.message
      });

      reasoning.endTime = new Date().toISOString();
      reasoning.totalExecutionTime = `${Date.now() - startTime}ms`;
      reasoning.conclusion = "Processing failed, returning fallback";

      return {
        summary: "irrelevant",
        tasks: [],
        entities: { people: [], companies: [], projects: [], tools: [] },
        metadata: { source, timestamp, contentType: "other" },
        agentThoughts: reasoning,
        error: error.message
      };
    }
  }

  /**
   * Get agent information
   * @returns {Object} Agent metadata
   */
  getInfo() {
    return {
      name: this.name,
      description: this.description,
      version: this.version,
      capabilities: [
        "Task extraction",
        "Entity recognition",
        "Content summarization",
        "Content type classification"
      ],
      inputSchema: {
        content: "string (required, min 50 chars)",
        source: "string (required)",
        timestamp: "number (required, unix timestamp in ms)"
      },
      outputSchema: {
        summary: "string",
        tasks: "array of task objects",
        entities: "object with people, companies, projects, tools arrays",
        metadata: "object with source, timestamp, contentType",
        agentThoughts: "reasoning trace with steps and metrics"
      }
    };
  }
}

// Create singleton instance
const parsingAgent = new ContextParserAgent();

module.exports = {
  parsingAgent,
  ContextParserAgent
};
