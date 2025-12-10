// Auto-update manifest.json matches array from config.js
// Run this script whenever you modify config.js

const fs = require('fs');
const path = require('path');

// Read config.js
const configPath = path.join(__dirname, 'config.js');
const configContent = fs.readFileSync(configPath, 'utf8');

// Extract domains from AUTO_CAPTURE_SITES
const domainsMatch = configContent.match(/AUTO_CAPTURE_SITES\s*=\s*\{([^}]+)\}/s);
if (!domainsMatch) {
  console.error('❌ Could not find AUTO_CAPTURE_SITES in config.js');
  process.exit(1);
}

const domainsContent = domainsMatch[1];
const domainRegex = /"([^"]+)":\s*\d+/g;
const domains = [];
let match;

while ((match = domainRegex.exec(domainsContent)) !== null) {
  domains.push(match[1]);
}

console.log(`✓ Found ${domains.length} domains in config.js:`, domains);

// Read manifest.json
const manifestPath = path.join(__dirname, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Update matches array
const matches = domains.map(domain => `*://${domain}/*`);
manifest.content_scripts[0].matches = matches;

// Write manifest.json
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log('✅ manifest.json updated successfully!');
console.log('📝 Updated matches:', matches);
console.log('\n🔄 Remember to reload the extension in chrome://extensions/');
