// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

chrome.storage.sync.clear();

chrome.tabs.onRemoved.addListener(function(tabId) {
    console.log('removing ' + tabId);
    chrome.storage.sync.remove(String(tabId));
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var toStore = {};
    toStore[String(tabId)] = { 
        date: Date(),
        title: tab.title,
        url: tab.url
    };
        
    chrome.storage.sync.set(toStore);
});

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        chrome.storage.sync.get(null, function(el) {
            console.log(el);
            sendResponse(el);
            return true;
        });
    }
);


