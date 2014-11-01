//something

var allKeys;

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response);
});
console.log('hi');
