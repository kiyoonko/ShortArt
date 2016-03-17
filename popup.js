// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */

 var ID = '5da7ddfd';
 var key = 'a5ce3caf51cb8779e61ab32f1d421c97';
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

// function createRequest(){
//   var result = null;
//   if (window.XMLHttpRequest) {
//     // FireFox, Safari, etc.
//     result = new XMLHttpRequest();
//     if (typeof xmlhttp.overrideMimeType != 'undefined') {
//       result.overrideMimeType('text/xml'); // Or anything else
//     }
//   }
//   else if (window.ActiveXObject) {
//     // MSIE
//     result = new ActiveXObject("Microsoft.XMLHTTP");
//   } 
//   else {
//     // No known mechanism -- consider aborting the application
//   }
//   return result;
// }

// function summarize(url, callback, errorCallback){
//   var summarizeUrl = 'https://api.aylien.com/api/v1/summarize?url=';
//   var x = new XMLHttpRequest();
//   x.open('GET', summarizeUrl, key, ID);
//   x.reponseType = 'json';

//   x.onload = function(){
//     var response = x.reponse;
//      if (!response || !response.responseData || !response.responseData.results ||
//         response.responseData.results.length === 0) {
//       errorCallback('No response Aylien Analyzer!');
//       return;
//     }
//     var summary = response.responseData.results[1];
//   };
//     x.onerror = function() {
//       errorCallback('Network Error.');
//     };
//     x.send();
// }

function getsummary(Arturl){
  var xhr = new XMLHttpRequest();
  $.ajax({
    beforeSend: function(xhr){
      xhr.setRequestHeader('X-AYLIEN-TextAPI-Application-ID', ID);
      xhr.setRequestHeader('X-AYLIEN-TextAPI-Application-Key', key);
    },

    url: "https://api.aylien.com/api/v1/summarize",
    type: "GET",
    async: true,
    data: {
      'url' : Arturl,
      format: 'json',
    },
    error: function (data) {
      var json_response = data;
      renderStatus('Something went wrong! Error Code: '+json_response);
    },
    success: function (data) {
      var json_response = data;
      renderStatus('Summary: ' +"\n" + json_response.sentences[0]+ "\n" + json_response.sentences[1] + "\n" + json_response.sentences[2] + "\n" + json_response.sentences[3] + "\n" + json_response.sentences[4]);
    }
  });
}

function renderStatus(statusText) {
  document.getElementById('status').innerText = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    // Put the image URL in Google search.
    renderStatus('Summarizing...');
    getsummary(url);
    // summarize(url, function(summary) {

    //   renderStatus('Summary: '+summary);
    // }, function(errorMessage) {
    //   renderStatus('Something went wrong!');
    // });
  });
});