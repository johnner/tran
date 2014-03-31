/*global chrome*/
//namespace
var tran = window.tran = {};
(function () {
  "use strict";

tran = {
  protocol: 'http',
  host: 'www.multitran.ru',
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
        var translate = fragment.querySelector('#translation ~ table');
        if (translate) {
          translate.className = "___mtt_translate_table";
          translate.setAttribute("cellpadding", "5");
          tran.fixImages(translate);
          tran.fixLinks(translate);
        } else {
          translate = translate || "Не удалось перевести";
        }
        chrome.tabs.getSelected(null, function(tab) {
          chrome.tabs.sendMessage(tab.id, {action:  "open_dialog_box", data: translate.outerHTML});
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
    this.fixUrl(fragment, 'img', 'src');
    return fragment;
  },

  fixLinks: function (fragment) {
    this.fixUrl(fragment, 'a', 'href');
    return fragment;
  },

  fixUrl: function (fragment, tag, attr) {
    var tags =  fragment.querySelectorAll(tag);
    var parser = document.createElement('a');
    for (var i = 0; i < tags.length; i ++ ) {
      parser.href = tags[i][attr];
      parser.host = tran.host;
      parser.protocol = tran.protocol;
      //fix relative links
      if (parser.pathname.indexOf('m.exe') !== -1) {
        parser.pathname = '/c'+parser.pathname;
      }
      tags[i][attr] = parser.href;
    }
  }
};

}());
