const fs = require("fs");
const path = require("path");

const promptName = process.argv[2];
const content = process.argv[3] || "Write your template prompt here.";

if (!promptName) {
  console.error("❌ Error: promptName is required.");
  process.exit(1);
}

const promptsDir = path.join(__dirname, "../../backend/lib/prompts");

// Ensure folder exists
if (!fs.existsSync(promptsDir)) {
  fs.mkdirSync(promptsDir, { recursive: true });
}

const filePath = path.join(promptsDir, `${promptName}.txt`);

const template = `# Prompt Template: ${promptName}

${content}

`;

fs.writeFileSync(filePath, template, "utf8");

console.log(`✅ Prompt template created: ${filePath}`);
