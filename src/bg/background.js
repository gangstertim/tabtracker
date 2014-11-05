// var settings = new Store("settings", {
//   "sample_setting": "This is how you use Store.js to remember values"
// });

chrome.storage.sync.clear();

chrome.tabs.onRemoved.addListener(function(tabId) {
  chrome.storage.sync.remove(String(tabId));
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  var toStore = {};
  toStore[String(tabId)] = { 
    id: tab.id,
    title: tab.title,
    windowId: tab.windowId,
    date: Date(),
    url: tab.url
  };
    
  chrome.storage.sync.set(toStore);
});

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    chrome.storage.sync.get(request.currentTabs, function(tabs) {
        sendResponse(tabs);
        chrome.storage.sync.clear();
        chrome.storage.sync.set(tabs);
    });
    return true;
  }
);


