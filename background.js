'use strict';

// Relay COLOR_PICKED messages from content scripts to the popup
chrome.runtime.onMessage.addListener((msg, _sender) => {
  if (msg.type === 'COLOR_PICKED') {
    chrome.runtime.sendMessage(msg).catch(() => {
      // Popup may be closed — store for next open
      chrome.storage.local.set({ pendingColor: msg.hex });
    });
  }
});

// Keyboard shortcut: Alt+Shift+C → trigger eyedropper in active tab
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'pick-color') return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  chrome.tabs.sendMessage(tab.id, { type: 'LAUNCH_EYEDROPPER' }).catch(() => {});
});

// On install: set default storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['colorHistory', 'palettes'], (data) => {
    if (!data.colorHistory) chrome.storage.local.set({ colorHistory: [] });
    if (!data.palettes) chrome.storage.local.set({ palettes: [] });
  });
});
