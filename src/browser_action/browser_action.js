var addEndpoint = 'https://www.instapaper.com/api/add';
var username = 'hungryhungrytimo@gmail.com';
var password = password;

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
var currentWindow;
chrome.windows.get(-2, function(t) {currentWindow = t.id});

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
      var otherTabs = [];
      var currTabs = [];
      var tabs = $.map(response, function(value, index) {
        return [value];
      });

      console.log(tabs);
      console.log(chrome.windows.WINDOW_ID_CURRENT);
      tabs.sort(function(a, b) {
        return a.date - b.date;
      }).forEach(function(tab) {
        tab.date = currentDatetime.getTime() - new Date(tab.date).getTime();
        tab.date/= 1000 //convert to seconds
        tab.date = secondsToString(tab.date);
        if (tab.windowId == currentWindow) {
          currTabs.push(tab);
        } else {
          otherTabs.push(tab);
        }
      });

      second.resolve([currTabs, otherTabs]);
    });
  });

  second.done(function(tabs) {
    $scope.currTabs = tabs[0];
    $scope.otherTabs = tabs[1];
    $scope.$apply();
  });
}]);

$(document).on('mouseover', '.title', function(e) {
  console.log('mouseover');
});

$(document).on('click', '#open', function(e) {
  chrome.tabs.update(parseInt(e.target.dataset.id), {highlighted: true});
});

$(document).on('click', '#close', function(e) {
  chrome.tabs.remove(parseInt(e.target.dataset.id));
  $(e.target).closest('li').remove();
});

$(document).on('click', '#instapaper-clickable', function(e) {
  console.log(e.target.dataset.url + ' added to instapaper');

  $.post(addEndpoint, {
    username: 'username',
    password: 'password',
    url: e.target.dataset.url
  }).done(function() {
      $('#notifications').text('Tab added successfully!');
      $('#notifications').css('background-color', 'green');
      clearNotifications();
    }).fail(function() {
      $('#notifications').text('Something went wrong')
      $('#notifications').css('background-color', 'red');
      clearNotifications();
    });

  var clearNotifications = function() {
    setTimeout(function() {
      $('#notifications').text('');
      $('#notifications').css('background-color', 'white');
    }, 3000);
  };
});

