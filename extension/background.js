// ContextOS Reader - Background Service Worker with Auto-Capture & Deduplication

// Import configuration from centralized config file
importScripts('config.js');
// AUTO_CAPTURE_SITES is now available from config.js

// Deduplication state
const recentHashes = new Set();
const MAX_HASH_HISTORY = 200;
const lastCapturedTime = {};

/**
 * Compute SHA-256 hash of content for deduplication
 * @param {string} text - Content to hash
 * @returns {Promise<string>} - Hex string hash
 */
async function hashContent(text) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('[Hash] Error computing hash:', error);
    return null;
  }
}

/**
 * Check if content is duplicate (hash-based deduplication)
 * @param {string} hash - Content hash
 * @returns {boolean} - True if duplicate
 */
function isDuplicateHash(hash) {
  if (recentHashes.has(hash)) {
    return true;
  }

  // Add to recent hashes
  recentHashes.add(hash);

  // Maintain max size (remove oldest if exceeds limit)
  if (recentHashes.size > MAX_HASH_HISTORY) {
    const firstHash = recentHashes.values().next().value;
    recentHashes.delete(firstHash);
  }

  return false;
}

/**
 * Check if capture is too frequent (time-based throttling)
 * @param {string} hostname - Website hostname
 * @returns {boolean} - True if should skip (too frequent)
 */
function isTooFrequent(hostname) {
  const minGap = AUTO_CAPTURE_SITES[hostname];
  if (!minGap) {
    return false; // Not a monitored site, allow capture
  }

  const lastTime = lastCapturedTime[hostname] || 0;
  const now = Date.now();

  if (now - lastTime < minGap) {
    const remainingTime = Math.ceil((minGap - (now - lastTime)) / 1000);
    console.log(`[Throttle] Too soon for ${hostname} – skipped (wait ${remainingTime}s)`);
    return true;
  }

  lastCapturedTime[hostname] = now;
  return false;
}

/**
 * Send content to backend
 * @param {string} text - Content text
 * @param {string} hostname - Source hostname
 * @param {string} captureType - 'manual' or 'auto'
 * @returns {Promise<boolean>} - Success status
 */
async function sendToBackend(text, hostname, captureType = 'manual') {
  try {
    const response = await fetch('http://localhost:8000/api/context', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: text,
        source: `${hostname} (${captureType})`
      })
    });

    if (response.ok) {
      console.log(`✓ Context sent to backend successfully [${captureType}]`);
      return true;
    } else {
      console.error('✗ Backend responded with error:', response.status);
      return false;
    }
  } catch (fetchError) {
    console.error('✗ Failed to send context to backend:', fetchError.message);
    console.log('Make sure backend is running on http://localhost:8000');
    return false;
  }
}

/**
 * Process capture request with deduplication
 * @param {object} data - Capture data { text, hostname, trigger }
 * @param {string} captureType - 'manual' or 'auto'
 * @returns {Promise<object>} - Result { success, skipped, reason }
 */
async function processCaptureRequest(data, captureType = 'auto') {
  const { text, hostname, trigger } = data;

  console.log('=== ContextOS Reader ===');
  console.log('Capture type:', captureType);
  console.log('Source hostname:', hostname);
  console.log('Trigger:', trigger || 'manual_click');
  console.log('Total characters:', text.length);

  // For auto-capture, apply throttling (skip for manual captures)
  if (captureType === 'auto' && isTooFrequent(hostname)) {
    return { success: false, skipped: true, reason: 'throttled' };
  }

  // Hash-based deduplication (applies to both manual and auto)
  const hash = await hashContent(text);
  if (hash && isDuplicateHash(hash)) {
    console.log('[Dedup] Duplicate content skipped (hash match)');
    return { success: false, skipped: true, reason: 'duplicate_hash' };
  }

  // Send to backend
  const success = await sendToBackend(text, hostname, captureType);

  if (success) {
    console.log('Full captured text:', text);
  }

  console.log('========================');

  return { success, skipped: false };
}

// ==========================================
// MANUAL CAPTURE (Extension Button Click)
// ==========================================

chrome.action.onClicked.addListener(async (tab) => {
  try {
    console.log('[ManualCapture] Extension button clicked');

    // Inject script to capture visible text from the current tab
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: capturePageContent
    });

    if (results && results[0] && results[0].result) {
      const { text, hostname } = results[0].result;

      // Process capture (manual captures bypass throttling)
      const result = await processCaptureRequest(
        { text, hostname, trigger: 'manual_click' },
        'manual'
      );

      // Show user feedback
      const message = result.success
        ? `✓ Captured ${text.length} characters from ${hostname}`
        : result.skipped
        ? `⊘ Skipped: ${result.reason === 'duplicate_hash' ? 'Duplicate content' : 'Too frequent'}`
        : `✗ Failed to send to backend`;

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (msg) => alert(msg),
        args: [message]
      });
    }
  } catch (error) {
    console.error('[ManualCapture] Error:', error);
  }
});

// ==========================================
// AUTO-CAPTURE (From Content Script)
// ==========================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'AUTO_CAPTURE') {
    console.log(`[AutoCapture] Received from ${message.data.hostname}`);

    // Process capture asynchronously
    processCaptureRequest(message.data, 'auto')
      .then(result => {
        sendResponse(result);
      })
      .catch(error => {
        console.error('[AutoCapture] Error:', error);
        sendResponse({ success: false, skipped: false, error: error.message });
      });

    // Return true to indicate async response
    return true;
  }
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Function to be injected into the page for manual capture
 */
function capturePageContent() {
  const text = document.body.innerText;
  const hostname = window.location.hostname;
  
  // Log in the webpage console
  console.log('=== ContextOS Reader - Manual Capture ===');
  console.log('Source hostname:', hostname);
  console.log('Total characters:', text.length);
  console.log('==========================================');
  
  return {
    text: text,
    hostname: hostname
  };
}

// Log initialization
console.log('[ContextOS] Background service worker initialized');
console.log('[AutoCapture] Monitoring:', Object.keys(AUTO_CAPTURE_SITES).join(', '));
