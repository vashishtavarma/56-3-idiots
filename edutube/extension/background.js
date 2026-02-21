// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Required for side panel to open on click (Chrome 114+)
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
