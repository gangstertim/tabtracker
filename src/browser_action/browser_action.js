
var tabTracker = angular.module('tabTracker', []);
var tabs;
chrome.extension.sendRequest({greeting: "hello"}, function(response) {
    tabs = $.map(response, function(value, index) {
        return [value];
    });
});

setTimeout(tabTracker.controller('TabListCtrl', function($scope) {
    $scope.tabs = tabs;
}), 1000);

