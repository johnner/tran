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
  query: '&s=',
  lang: '?l1=2&l2=1', //from russian to english by default
  xhr: {},

  // context menu click handler
  click: function (data) {
    tran.search(data.selectionText, tran.successtHandler);
//    chrome.storage.sync.get({
//      language: '1'
//    }, function(items) {
//      tran.setLanguage(items.language);
//      tran.search(data.selectionText, tran.successtHandler);
//    });
  },

  setLanguage: function (language) {
    tran.lang = '?l1=2&l2=' + language;
  },
  /**
   * Request translation and run callback function
   * passing translated result or error to callback
   **/
  search: function (value, callback, err) {
    chrome.storage.sync.get({
      language: '1'
    }, function(items) {
      tran.setLanguage(items.language);
      var url = tran.makeUrl(value);
      var xhr = tran.xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function (e) {
        var xhr = tran.xhr;
        if (xhr.readyState < 4) { return; }
        if (xhr.status !== 200) { if (typeof err == 'function') err(); return;}
        if (xhr.readyState === 4) {
          if (typeof callback == 'function') {
            var translated = tran.parse(e.target.response);
            return callback(translated);
          }
        }
      }
      xhr.open("GET", url, true);
      xhr.send();
    });
  },

  makeUrl: function (value) {
    var url = [tran.protocol, '://',
              tran.host,
              tran.path,
              tran.lang,
              tran.query,
              encodeURI(value) ].join('');
    return url;
  },
  /**
   * Recieving data from translataion-engine and send ready message with data
   */
  successtHandler: function (translated) {
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {
          action:  "open_dialog_box",
          data: translated.outerHTML
        });
      });
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
          translate.innerText = "Unfortunately, could not translate";
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
