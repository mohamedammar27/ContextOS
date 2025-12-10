// ContextOS Reader - Content Script for Auto-Capture
// Runs on monitored websites to detect content changes

// AUTO_CAPTURE_SITES is loaded from config.js (injected via manifest)

// Track last capture attempt time per site
let lastCaptureAttempt = 0;
let debounceTimer = null;
let observer = null;

/**
 * Initialize auto-capture system
 */
function initAutoCapture() {
  const hostname = window.location.hostname;
  const minInterval = AUTO_CAPTURE_SITES[hostname];

  if (!minInterval) {
    console.log('[AutoCapture] Site not monitored:', hostname);
    return;
  }

  console.log(`[AutoCapture] Monitoring enabled for ${hostname} (min interval: ${minInterval}ms)`);

  // Initial capture when page loads
  scheduleCapture('page_load');

  // Set up MutationObserver to detect content changes
  setupMutationObserver();
}

/**
 * Set up MutationObserver to watch for DOM changes
 */
function setupMutationObserver() {
  const hostname = window.location.hostname;
  const minInterval = AUTO_CAPTURE_SITES[hostname];

  observer = new MutationObserver((mutations) => {
    // Filter out trivial mutations (class changes, style changes, etc.)
    const meaningfulMutations = mutations.filter(mutation => {
      // Ignore attribute-only changes
      if (mutation.type === 'attributes') {
        return false;
      }
      
      // Ignore mutations in script/style tags
      if (mutation.target.tagName === 'SCRIPT' || mutation.target.tagName === 'STYLE') {
        return false;
      }

      // Only care about text changes or node additions/removals
      return mutation.type === 'childList' || mutation.type === 'characterData';
    });

    if (meaningfulMutations.length > 0) {
      console.log(`[AutoCapture] Detected ${meaningfulMutations.length} meaningful DOM changes`);
      scheduleCapture('content_change');
    }
  });

  // Observe the entire document body
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    characterDataOldValue: false
  });

  console.log('[AutoCapture] MutationObserver activated');
}

/**
 * Schedule a capture with debouncing to avoid too-frequent triggers
 * @param {string} trigger - What triggered the capture ('page_load' or 'content_change')
 */
function scheduleCapture(trigger) {
  const hostname = window.location.hostname;
  const minInterval = AUTO_CAPTURE_SITES[hostname];

  // Clear existing debounce timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Debounce: wait 2 seconds after last mutation before capturing
  debounceTimer = setTimeout(() => {
    attemptCapture(trigger);
  }, 2000);
}

/**
 * Attempt to capture content (checks throttling)
 * @param {string} trigger - What triggered the capture
 */
function attemptCapture(trigger) {
  const hostname = window.location.hostname;
  const minInterval = AUTO_CAPTURE_SITES[hostname];
  const now = Date.now();

  // Time-based throttling: check if enough time has passed
  if (now - lastCaptureAttempt < minInterval) {
    const remainingTime = Math.ceil((minInterval - (now - lastCaptureAttempt)) / 1000);
    console.log(`[Throttle] Too soon – skipped (wait ${remainingTime}s more)`);
    return;
  }

  // Update last capture time
  lastCaptureAttempt = now;

  console.log(`[AutoCapture] Triggered on ${hostname} (reason: ${trigger})`);

  // Capture the content
  const text = document.body.innerText;

  // Send message to background script
  chrome.runtime.sendMessage({
    type: 'AUTO_CAPTURE',
    data: {
      text: text,
      hostname: hostname,
      trigger: trigger,
      timestamp: now
    }
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('[AutoCapture] Error sending to background:', chrome.runtime.lastError.message);
    } else if (response?.success) {
      console.log('[AutoCapture] ✓ Content captured successfully');
    } else if (response?.skipped) {
      console.log(`[Dedup] Duplicate skipped (${response.reason})`);
    }
  });
}

/**
 * Cleanup observer when page unloads
 */
window.addEventListener('beforeunload', () => {
  if (observer) {
    observer.disconnect();
    console.log('[AutoCapture] Observer disconnected');
  }
});

// Initialize auto-capture when script loads
initAutoCapture();

console.log('[AutoCapture] Content script loaded');
