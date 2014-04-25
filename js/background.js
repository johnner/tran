/*global tran, chrome*/
(function () {
"use strict";
// generates a context menu
chrome.contextMenus.create({
  title: 'Multitran: "%s"',
  contexts: ["page", "frame", "editable", "image",
            "video", "audio", "link", "selection"],
  onclick: tran.click
});

/**
 * Can't get chrome.storage directly from content_script
 * so content_script sends request message and then background script
 * responds with storage value
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

/**
 * Fast translation initiate search with 'request_search' message from
 * content_script
 */
chrome.runtime.onMessage.addListener(function (msg) {
  if (msg.method === 'request_search') {
    tran.click(msg.data);
  }
  return true;
});
})();
