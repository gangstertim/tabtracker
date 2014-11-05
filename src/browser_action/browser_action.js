var ApiUrl = 'https://www.instapaper.com/api/add'

//Move this guy out to a util.js function eventually
function secondsToString(seconds) {
  var datestring = '';
  var numdays = Math.floor((seconds % 31536000) / 86400); 
  var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  var numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);
  if (numdays) { datestring += numdays + " days and "; }
  if (numhours) { datestring += numhours + " hours, "; }
  if (numminutes) { datestring += numminutes + " minutes, and "; }
  datestring += numseconds + " seconds";
  return datestring;
}

var tabTracker = angular.module('tabTracker', []);

tabTracker.controller('TabListCtrl', ['$scope', function($scope) {
  var first = $.Deferred(), second = $.Deferred();

  chrome.tabs.query({}, function(tabs) {
    var currentTabIds = [];
    tabs.forEach(function(tab) {
      currentTabIds.push(String(tab.id));
    });
    first.resolve(currentTabIds)
  });

  first.done(function(currentTabIds) {
    chrome.extension.sendRequest({currentTabs: currentTabIds}, function(response) {
      var currentDatetime = new Date();
      var tabs = $.map(response, function(value, index) {
        return [value];
      });

      tabs.sort(function(a, b) {
        return a.date - b.date;
      }).forEach(function(tab) {
        tab.date = currentDatetime.getTime() - new Date(tab.date).getTime();
        tab.date/= 1000 //convert to seconds
        tab.date = secondsToString(tab.date);
      });

      second.resolve(tabs);
    });
  });

  second.done(function(tabs) {
    $scope.tabs = tabs;
    $scope.$apply();
  });
}]);

$(document).on('click', '.instapaper-clickable', function(e) {
  console.log(e.target.dataset.url + ' added to instapaper');
  var data = {
    username: 'mrtimo',
    password: 'instapaper25',
    url: e.target.dataset.url
  };

  $.post(ApiUrl, data)
    .done(function() {
      console.log('boom');
    }).fail(function() {
    console.log('fail');
    });

});

