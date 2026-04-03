/**
 * Screenshot preparation script
 *
 * PURPOSE:
 *   Replaces the real homeserver hostname in the Ketesa UI with a generic example value
 *   so that screenshots taken for documentation do not expose real infrastructure details.
 *
 * HOW TO USE:
 *   1. Open the Ketesa UI in your browser and navigate to the page you want to screenshot.
 *   2. Open DevTools (F12 or Cmd+Option+I on Mac) and go to the Console tab.
 *   3. Paste this entire script and press Enter.
 *   4. The replacement is active immediately and stays active as React re-renders the page.
 *   5. Take your screenshot.
 *
 * WHY THIS IS NEEDED:
 *   Ketesa displays the homeserver URL and Matrix user IDs (which include the server name)
 *   throughout the UI. Screenshots taken directly would reveal the real hostname of the
 *   server used for testing. This script replaces those values with "example.com" before
 *   the screenshot is captured, keeping infrastructure details out of public documentation.
 *
 * NOTE:
 *   The replacement is only visual — it does not change any application state or API calls.
 *   Refreshing the page will reset it; re-paste the script if needed after navigation.
 */
(function () {
  const FROM = "test:8008";
  const TO = "example.com";

  function replaceInNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.includes(FROM)) {
        node.textContent = node.textContent.replaceAll(FROM, TO);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Also replace values in input and textarea elements
      if ((node.tagName === "INPUT" || node.tagName === "TEXTAREA") && node.value.includes(FROM)) {
        node.value = node.value.replaceAll(FROM, TO);
      }
      for (const child of node.childNodes) replaceInNode(child);
    }
  }

  // Initial pass over already-rendered DOM
  replaceInNode(document.body);

  // Watch for React re-renders and replace text in newly added or changed nodes
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) replaceInNode(node);
      if (m.type === "characterData" && m.target.textContent.includes(FROM)) {
        m.target.textContent = m.target.textContent.replaceAll(FROM, TO);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  console.log("🔁 Text replacement active: " + FROM + " → " + TO);
})();
