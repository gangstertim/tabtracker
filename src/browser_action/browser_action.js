
var tabTracker = angular.module('tabTracker', []);
function secondsToString(seconds) {
    var numdays = Math.floor((seconds % 31536000) / 86400); 
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    return numdays + " days and " + numhours + " hours, " + numminutes + " minutes, and  " + numseconds + " seconds";
}

tabTracker.controller('TabListCtrl', ['$scope', function($scope) {
    var tabs;
    var deferred = $.Deferred();
    deferred.done(function(tabs) {
        $scope.tabs = tabs;
        console.log($scope.tabs);
        $scope.$apply();
    });

    chrome.extension.sendRequest({greeting: "hello"}, function(response) {
        var currentDatetime = new Date();
        tabs = $.map(response, function(value, index) {
            return [value];
        });
        tabs.sort(function(a, b) {
            return a.date - b.date;
        });
        tabs.forEach(function(tab) {
            tab.date = currentDatetime.getTime() - new Date(tab.date).getTime();
            tab.date/= 1000 //convert to seconds
            tab.date = secondsToString(tab.date);
        });
        deferred.resolve(tabs);
    });
}]);


