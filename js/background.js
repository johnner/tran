/*global tran, chrome*/
(function () {
"use strict";
// generates a context menu and launches setupQR() every time an item is rightclicked
chrome.contextMenus.create({
  title: 'Multitran: "%s"',
  contexts: ["page", "frame", "editable", "image", "video", "audio", "link", "selection"],
  onclick: tran.click
});

})();
