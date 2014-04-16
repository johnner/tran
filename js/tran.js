/*global chrome*/
/**
 * Translation-module that makes requests to language-engine,
 * parses results and sends plugin-global message with translation data
 */
var tran = window.tran = {};
(function () {
  "use strict";

tran = {
  TABLE_CLASS: "___mtt_translate_table",
  protocol: 'http',
  host: 'www.multitran.ru',
  path: '/c/m.exe',
  query: '?s=',
  xhr: {},

  // context menu click handler
  click: function (data) {
    tran.request(data);
  },

  request: function (data) {
    var url = [tran.protocol, '://',
              tran.host,
              tran.path,
              tran.query,
              encodeURI(data.selectionText) ].join('');
    var xhr = tran.xhr = new XMLHttpRequest();
    xhr.onreadystatechange = tran.requestHandler;
    xhr.open("GET", url, true);
    xhr.send();
  },

  /**
   * Recieving data from translataion-engine, parse
   * and send ready message with data
   */
  requestHandler: function (e) {
    var xhr = tran.xhr;
    if(xhr.readyState < 4) { return; }
    if(xhr.status !== 200) { return; }
    if(xhr.readyState === 4) {
      var translate = tran.parse(e.target.response);
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {
          action:  "open_dialog_box",
          data: translate.outerHTML
        });
      });
    }
  },

  parse: function (response) {
      var doc = tran.stripScripts(response);
      var fragment = tran.makeFragment(doc);
      var translate;
      if (fragment) {
        translate = fragment.querySelector('#translation ~ table');
        if (translate) {
          translate.className = tran.TABLE_CLASS;
          translate.setAttribute("cellpadding", "5");
          tran.fixImages(translate);
          tran.fixLinks(translate);
        } else {
          translate = document.createElement('div');
          translate.className = 'failTranslate';
          translate.innerText = "Sorry, translation failed";
        }
      }
      return translate;
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
