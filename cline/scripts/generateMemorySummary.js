/**
 * Lightweight memory summarizer
 *
 * Usage:
 *   node cline/scripts/generateMemorySummary.js backend/memory
 *
 * Purpose:
 *   - Read JSON files under the given folder (recursively)
 *   - For each JSON file produce a small summary:
 *       - file path
 *       - file size (bytes)
 *       - top-level type (object / array / primitive)
 *       - if array/object: number of items / keys
 *       - sample (first 1-2 items or first 2 keys)
 *   - Write result to backend/memory/summary.json (overwrites only this file)
 *
 * Non-destructive: reads files only, writes one summary file.
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

async function walk(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

function safeParseJson(content) {
  try {
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

function shortSample(value) {
  if (Array.isArray(value)) {
    return value.slice(0, 2);
  } else if (value && typeof value === 'object') {
    const keys = Object.keys(value).slice(0, 2);
    const sample = {};
    for (const k of keys) sample[k] = value[k];
    return sample;
  } else {
    return value;
  }
}

async function summarize(folderPath) {
  const absFolder = path.resolve(process.cwd(), folderPath || 'backend/memory');

  // Validate path
  try {
    const stat = await fsp.stat(absFolder);
    if (!stat.isDirectory()) {
      throw new Error(`${absFolder} is not a directory`);
    }
  } catch (err) {
    console.error(`❌ Folder not found or inaccessible: ${absFolder}`);
    process.exit(1);
  }

  const allFiles = await walk(absFolder);
  const jsonFiles = allFiles.filter(f => f.toLowerCase().endsWith('.json') && !f.toLowerCase().endsWith('summary.json'));

  const summary = {
    generatedAt: new Date().toISOString(),
    folder: folderPath,
    filesSummarized: jsonFiles.length,
    items: []
  };

  for (const file of jsonFiles) {
    try {
      const raw = await fsp.readFile(file, 'utf8');
      const parsed = safeParseJson(raw);

      const stats = await fsp.stat(file);

      const node = {
        path: path.relative(process.cwd(), file),
        bytes: stats.size,
        parsed: parsed !== null,
      };

      if (parsed === null) {
        node.note = 'file not valid JSON or parse failed';
      } else {
        if (Array.isArray(parsed)) {
          node.type = 'array';
          node.count = parsed.length;
          node.sample = shortSample(parsed);
        } else if (parsed && typeof parsed === 'object') {
          node.type = 'object';
          node.keys = Object.keys(parsed).length;
          node.sample = shortSample(parsed);
        } else {
          node.type = typeof parsed;
          node.sample = parsed;
        }
      }

      summary.items.push(node);
    } catch (err) {
      console.warn(`⚠️ Failed to read ${file}: ${err.message}`);
      summary.items.push({
        path: path.relative(process.cwd(), file),
        error: err.message
      });
    }
  }

  // Write summary file
  const outFile = path.join(absFolder, 'summary.json');
  await fsp.writeFile(outFile, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`✅ Summary written to ${outFile}`);
  return summary;
}

/* run */
(async () => {
  const folderPath = process.argv[2] || 'backend/memory';
  try {
    const result = await summarize(folderPath);
    // Also print a compact console summary for quick verification
    console.log(`Summary generated at: ${result.generatedAt}`);
    console.log(`Files summarized: ${result.filesSummarized}`);
    if (result.items.length > 0) {
      console.log(`Sample file: ${result.items[0].path} (${result.items[0].type || result.items[0].note})`);
    }
  } catch (e) {
    console.error(`❌ Error while summarizing: ${e.stack || e.message}`);
    process.exit(1);
  }
})();
