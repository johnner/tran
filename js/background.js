/*global tran, chrome*/
(function () {
"use strict";
// generates a context menu and launches setupQR() every time an item is rightclicked
chrome.contextMenus.create({
  title: 'Multitran: "%s"',
  contexts: ["page", "frame", "editable", "image",
            "video", "audio", "link", "selection"],
  onclick: tran.click
});

/**
 * Can't get chrome.storage directly from content_script
 * so content_script send requset message and background script responds with
 * storage value
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "get_fast_option") {
      chrome.storage.sync.get({
        fast: false
      }, function(items) {
        sendResponse({fast: items.fast});
      });
    }
});

chrome.runtime.onMessage.addListener(function (msg) {
  console.log(msg.method);
  if (msg.method === 'request_search') {
    console.log(msg);
    tran.click(msg.data);
  }
  return true;
});
})();
