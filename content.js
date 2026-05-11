'use strict';

// Listens for messages from background (keyboard shortcut trigger)
chrome.runtime.onMessage.addListener(async (msg, _sender, sendResponse) => {
  if (msg.type === 'LAUNCH_EYEDROPPER') {
    if (!window.EyeDropper) {
      sendResponse({ error: 'EyeDropper API not available' });
      return;
    }
    try {
      const dropper = new EyeDropper();
      const result = await dropper.open();
      if (result?.sRGBHex) {
        chrome.runtime.sendMessage({ type: 'COLOR_PICKED', hex: result.sRGBHex });
        sendResponse({ hex: result.sRGBHex });
      }
    } catch (e) {
      sendResponse({ cancelled: true });
    }
  }
});
