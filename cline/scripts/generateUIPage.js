const fs = require("fs");
const path = require("path");

const pageName = process.argv[2];

if (!pageName) {
  console.error("❌ Error: pageName is required.");
  process.exit(1);
}

const appDir = path.join(__dirname, "../../ui/app");
const pageDir = path.join(appDir, pageName);
const pageFile = path.join(pageDir, "page.jsx");

// Ensure folder exists
if (!fs.existsSync(pageDir)) {
  fs.mkdirSync(pageDir, { recursive: true });
}

const template = `export default function ${capitalize(pageName)}Page() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>${capitalize(pageName)} Page</h1>
      <p>This page was auto-generated using a Cline ability.</p>
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
`;

fs.writeFileSync(pageFile, template, "utf8");

console.log(`✅ UI page created at: ${pageFile}`);
