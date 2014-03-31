/*global chrome*/
//namespace
var tran = window.tran = {};
(function () {
  "use strict";

tran = {
  xhr: {},
  // context menu click handler
  click: function (data) {
    //http://www.multitran.ru/c/m.exe?l1=1&l2=2&s=hi
    var xhr = tran.xhr = new XMLHttpRequest();
    xhr.onreadystatechange = tran.requestHandler; // Implemented elsewhere.
    xhr.open("GET", "http://www.multitran.ru/c/m.exe?l1=1&l2=2&s=" + data.selectionText, true);
    xhr.send();
  },
  requestHandler: function (e) {
    var xhr = tran.xhr;
    if(xhr.readyState < 4) { return; }
    if(xhr.status !== 200) { return; }
    if(xhr.readyState === 4) {
      var doc = tran.stripScripts(e.target.response);
      var fragment = tran.makeFragment(doc);
      if (fragment) {
        fragment = tran.fixImages(fragment);
        var translate = fragment.querySelector('#translation ~ table');
        translate = translate || "Не удалось перевести";
        chrome.tabs.getSelected(null, function(tab) {
          chrome.tabs.sendMessage(tab.id, {action:  "open_dialog_box", data: translate.innerHTML});
        });
      }
    }
  },

  stripScripts: function (s) {
    var div = document.createElement('div');
    div.innerHTML = s;
    var scripts = div.getElementsByTagName('script');
    var i = scripts.length;
    while (i--) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }
    return div.innerHTML;
  },

  makeFragment: function (doc) {
    var div = document.createElement("div");
    div.innerHTML = doc;
    var fragment = document.createDocumentFragment();
    while ( div.firstChild ) {
      fragment.appendChild( div.firstChild );
    }
    return fragment;
  },

  fixImages: function (fragment) {
    var imgHost = 'http://www.multitran.ru';
    var imgs = fragment.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i ++ ) {
      if (imgs[i].src.indexOf(imgHost) == -1) {

        imgs[i].src = imgHost +  imgs[i].src;
      }
    }
    return fragment;
  }
};

}());
