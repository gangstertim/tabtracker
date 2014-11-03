
var tabTracker = angular.module('tabTracker', []);

/*
tabTracker.controller('TabListCtrl', function($scope) {
    chrome.extension.sendRequest({greeting: "hello"}, function(response) {
        $scope.tabs = $.map(response, function(value, index) {
            return [value];
        });
        console.log($scope.tabs);
    });
});
*/

tabTracker.controller('TabListCtrl', ['$scope', function($scope) {
    var tabs;
    var deferred = $.Deferred();
    deferred.done(function(tabs) {
        $scope.tabs = tabs;
        console.log($scope.tabs);
        $scope.$apply();
    });

    chrome.extension.sendRequest({greeting: "hello"}, function(response) {
        tabs = $.map(response, function(value, index) {
            return [value];
        });
        deferred.resolve(tabs);
    });
}]);


