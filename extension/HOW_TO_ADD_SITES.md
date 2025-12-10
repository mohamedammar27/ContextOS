# Adding New Websites to Auto-Capture

## 🎯 Simple 2-Step Process

### Step 1: Edit `config.js`
Open `extension/config.js` and add your website:

```javascript
const AUTO_CAPTURE_SITES = {
  "web.whatsapp.com": 20000,
  "discord.com": 15000,
  "mail.google.com": 30000,
  "linkedin.com": 25000,
  "slack.com": 20000,
  "twitter.com": 25000,
  "reddit.com": 30000  // ← Add your site here
};
```

**Time intervals (in milliseconds):**
- Chat apps: 15,000 - 20,000 (15-20 seconds)
- Email: 30,000 (30 seconds)
- Social media: 25,000 - 30,000 (25-30 seconds)

### Step 2: Update Manifest (Automatic)
Run the update script:

```bash
cd extension
node update-manifest.js
```

This automatically:
- ✅ Reads domains from `config.js`
- ✅ Updates `manifest.json` matches array
- ✅ No manual editing needed!

### Step 3: Reload Extension
1. Go to `chrome://extensions/`
2. Click 🔄 reload on ContextOS Reader
3. Visit the new website - auto-capture should work!

---

## 📝 Example: Adding Reddit

**Before:**
```javascript
const AUTO_CAPTURE_SITES = {
  "twitter.com": 25000
};
```

**After:**
```javascript
const AUTO_CAPTURE_SITES = {
  "twitter.com": 25000,
  "reddit.com": 30000  // ← Added
};
```

**Run:**
```bash
node update-manifest.js
```

**Result:**
```
✓ Found 7 domains in config.js: [..., 'reddit.com']
✅ manifest.json updated successfully!
📝 Updated matches: [..., '*://reddit.com/*']

🔄 Remember to reload the extension in chrome://extensions/
```

---

## 🎓 How It Works

```
config.js (single source of truth)
    ↓
update-manifest.js (reads config, updates manifest)
    ↓
manifest.json (loads config.js into both scripts)
    ↓
background.js + content.js (use AUTO_CAPTURE_SITES)
```

**Files that auto-sync:**
- ✅ `background.js` - Uses config via `importScripts`
- ✅ `content.js` - Uses config via manifest injection
- ✅ `manifest.json` - Auto-updated by script

---

## 🚀 Quick Reference

| Task | Command |
|------|---------|
| Add website | Edit `config.js` → Run `node update-manifest.js` |
| Change interval | Edit `config.js` → Run `node update-manifest.js` |
| Remove website | Delete from `config.js` → Run `node update-manifest.js` |
| Check config | `cat config.js` |
| Verify manifest | `cat manifest.json` |

---

## ⚠️ Important Notes

1. **Always run `update-manifest.js` after editing `config.js`**
2. **Always reload extension after running script**
3. **Domain format**: Use base domain only (e.g., `"reddit.com"`, not `"www.reddit.com"`)
4. **Manifest matches**: Script auto-generates `*://domain.com/*` patterns

---

## 🐛 Troubleshooting

**Script fails with "Could not find AUTO_CAPTURE_SITES":**
- Check `config.js` syntax is correct
- Ensure the object is named exactly `AUTO_CAPTURE_SITES`

**Website not being monitored:**
- Check console logs on the website (F12)
- Should see: `[AutoCapture] Monitoring enabled for <hostname>`
- If not, reload extension and hard-refresh page (Ctrl+Shift+R)

**Changes not taking effect:**
- Did you reload the extension?
- Did you hard-refresh the webpage?
- Check `manifest.json` was actually updated
