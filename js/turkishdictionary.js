"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

/*
  Translation engine: http://www.turkishdictionary.net
  For translating turkish-russian and vice versa
*/
var CHAR_CODES = require("./char-codes-turk.js");

var TurkishDictionary = (function () {
  function TurkishDictionary() {
    this.host = "http://www.turkishdictionary.net/?word=%FC";
    this.path = "";
    this.protocol = "http";
    this.query = "&s=";
    this.TABLE_CLASS = "___mtt_translate_table";
    this.need_publish = true;
  }

  _prototypeProperties(TurkishDictionary, null, {
    search: {
      value: function search(data) {
        data.url = this.makeUrl(data.value);
        this.need_publish = false;
        return this.request(data);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    translate: {
      value: function translate(data) {
        console.log("request data:", data);
        data.url = this.makeUrl(data.selectionText);
        this.need_publish = true;
        this.request(data);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    makeUrl: {
      value: function makeUrl(text) {
        return ["http://www.turkishdictionary.net/?word=", text].join("");
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    request: {

      /*
        Request translation and run callback function
        passing translated result or error to callback
      */
      value: function request(opts) {
        console.log("start request");
        this.xhr = new XMLHttpRequest();
        this.xhr.onreadystatechange = this.onReadyStateChange.bind(this, opts);
        this.xhr.open("GET", opts.url, true);
        this.xhr.send();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    onReadyStateChange: {
      value: function onReadyStateChange(opts, e) {
        var xhr = this.xhr;
        if (xhr.readyState < 4) {
          return;
        } else if (xhr.status != 200) {
          this.errorHandler(xhr);
          return opts.error && opts.error();
        } else if (xhr.readyState == 4) {
          var translation = this.successHandler(e.target.response);
          console.log("success turkish translate", translation);
          console.log("call", opts.success);
          return opts.success && opts.success(translation);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    successHandler: {
      value: function successHandler(response) {
        var data = this.parse(response);
        if (this.need_publish) {
          chrome.tabs.getSelected(null, this.publishTranslation.bind(this, data));
        }
        return data;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    publishTranslation: {

      /* publish successfuly translated text all over extension */
      value: function publishTranslation(translation, tab) {
        console.log("publish translation");
        chrome.tabs.sendMessage(tab.id, {
          action: "open_tooltip",
          data: translation.outerHTML,
          success: !translation.classList.contains("failTranslate")
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    errorHandler: {
      value: function errorHandler(response) {
        console.log("error ajax", response);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    parse: {

      /* Parse response from translation engine */
      value: function parse(response, silent, translate) {
        var doc = this.stripScripts(response),
            fragment = this.makeFragment(doc);
        if (fragment) {
          translate = fragment.querySelector("#meaning_div > table");
          if (translate) {
            translate.className = this.TABLE_CLASS;
            translate.setAttribute("cellpadding", "5");
            // @fixImages(translate)
            // @fixLinks(translate)
          } else if (!silent) {
            translate = document.createElement("div");
            translate.className = "failTranslate";
            translate.innerText = "Unfortunately, could not translate";
          }
        }
        return translate;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    stripScripts: {

      //TODO extract to base engine class
      /* removes <script> tags from html code */
      value: function stripScripts(html) {
        var div = document.createElement("div");
        div.innerHTML = html;
        var scripts = div.getElementsByTagName("script");
        var i = scripts.length;
        while (i--) scripts[i].parentNode.removeChild(scripts[i]);
        return div.innerHTML;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    makeFragment: {

      //TODO extract to base engine class
      /* creates temp object to parse translation from page 
        (since it's not a friendly api) 
      */
      value: function makeFragment(html) {
        var fragment,
            div = document.createElement("div");
        div.innerHTML = html;
        fragment = document.createDocumentFragment();
        while (div.firstChild) {
          fragment.appendChild(div.firstChild);
        }
        return fragment;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return TurkishDictionary;
})();

// Singletone
module.exports = new TurkishDictionary();