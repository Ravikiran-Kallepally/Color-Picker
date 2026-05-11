'use strict';

// Relay COLOR_PICKED messages from content scripts to the popup
chrome.runtime.onMessage.addListener((msg, _sender) => {
  if (msg.type === 'COLOR_PICKED') {
    // Forward to all extension views (popup)
    chrome.runtime.sendMessage(msg).catch(() => {
      // Popup may be closed — store for next open
      chrome.storage.local.set({ pendingColor: msg.hex });
    });
  }
});

// On install: set default storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['colorHistory', 'palettes'], (data) => {
    if (!data.colorHistory) chrome.storage.local.set({ colorHistory: [] });
    if (!data.palettes) chrome.storage.local.set({ palettes: [] });
  });
});
