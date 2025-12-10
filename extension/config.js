// ContextOS Auto-Capture Configuration
// Edit this file to add/remove monitored websites

/**
 * Auto-capture sites configuration
 * Key: hostname (e.g., "twitter.com")
 * Value: minimum milliseconds between captures
 * 
 * To add a new site:
 * 1. Add line: "domain.com": 25000,
 * 2. Reload extension in chrome://extensions/
 * 
 * Recommended intervals:
 * - Chat apps (WhatsApp, Discord, Slack): 15-20 seconds
 * - Email (Gmail): 30 seconds
 * - Social media (Twitter, LinkedIn): 25-30 seconds
 */
const AUTO_CAPTURE_SITES = {
  "twitter.com": 25000
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AUTO_CAPTURE_SITES };
}
