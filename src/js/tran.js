/**
 Multitran translate engine
 Provides program interface for making translate queries to multitran and get clean response

 All engines must follow common interface and provide methods:
 - search (languange, successHandler)  clean translation must be passed into successHandler
 - click

 Translation-module that makes requests to language-engine,
 parses results and sends plugin-global message with translation data
 **/
// var iconv = require('iconv-lite');

import CHAR_CODES from './char-codes.js';
import TranslationParser from './parsers/multitran/translation-parser';

class Tran {
  constructor() {
    this.tableClassName = "___mtt_translate_table";
    this.protocol = 'http';
    this.host = 'www.multitran.ru';
    this.path = '/c/m.exe';
    this.query = '&s=';
    this.lang = '?l1=2&l2=1'; // from russian to english by default
    this.xhr = {}
  }

  /**
   * Context menu click handler
   */
  click(data) {
    if (typeof data.silent === "undefined" || data.silent === null) {
      data.silent = true; // true by default
    }
    let selectionText = this.removeHyphenation(data.selectionText);
    this.search({
      value: selectionText,
      success: (result) => this.successtHandler(result),
      silent: data.silent // if translation failed do not show dialog
    });
  }

  /**
   * Discard soft hyphen character (U+00AD, &shy;) from the input
   */
  removeHyphenation(text) {
    return text.replace(/\xad/g, '');
  }

  /**
   * Initiate translation search
   */
  search(params) {
    //value, callback, err
    chrome.storage.sync.get({ language: '1' }, (items) => {
      if (items.language === '') {
        items.language = '1';
      }
      this.setLanguage(items.language);
      const url = this.makeUrl(params.value);
      // decorate success to make preliminary parsing
      const origSuccess = params.success;
      params.success = (response) => {
        let translated = this.parse(response, params.silent);
        origSuccess.call(this, translated);
      };

      this.request({
        url: url,
        success: params.success,
        error: params.error
      });
    })
  }

  // Parse response from the multitran
  parse(response, silent) {
    return new TranslationParser({ sourceHtml: response });
    // console.log('=======parsed', parsed);
    // if (resultTableEl) {
    //   resultTableEl.className = this.tableClassName;
    //   resultTableEl.setAttribute("cellpadding", "5");
    //   this.fixImages(resultTableEl);
    //   this.fixLinks(resultTableEl);
    // } else if (!silent) {
    //   resultTableEl = document.createElement('div');
    //   resultTableEl.className = 'failTranslate';
    //   resultTableEl.innerText = "Unfortunately, could not translate";
    // }
    // return resultTableEl;
  }

  setLanguage(language) {
    this.currentLanguage = language;
    this.lang = `?l1=2&l2=${language}`;
  }

  /**
   * Request translation and run callback function
   * passing translated result or error to callback
   * @param opts
   */
  request(opts) {
    let xhr = this.xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (e) => {
      xhr = this.xhr;
      if (xhr.readyState < 4) {
        return;
      }
      else if (xhr.status !== 200) {
        this.errorHandler(xhr);
        if (typeof opts.error === 'function') {
          opts.error.call(this);
        }
        return;
      } else if (xhr.readyState === 4) {
        return opts.success(e.target.response);
      }
      return xhr;
    };
    xhr.overrideMimeType("text/html;charset=utf-8");
    xhr.open("GET", opts.url, true);

    xhr.send();
  }

  makeUrl(value) {
    return `${this.protocol}://${this.host}${this.path}${this.lang}${this.query}${this.getEncodedValue(value)}`;
  }

  // Replace special language characters to html codes
  getEncodedValue(value) {
    //to find spec symbols we first encode them (raw search for that symbol doesn't work)
    let val = encodeURIComponent(value);
    let code, cc;
    for (let char in CHAR_CODES) {
      if (CHAR_CODES.hasOwnProperty(char)) {
        code = CHAR_CODES[char];
        if (typeof code === 'object') {
          // russian has special codes
          cc = code.val;
        } else {
          //for all langs except russian encode html-codes needed
          cc = encodeURIComponent(code);
        }
        val = val.replace(char, cc);
      }
    }
    return val;
  }

  errorHandler() {
    // console.log('xhr error:', xhr);
  }

  //Receiving data from translation-engine and send ready message with data
  successtHandler(translated) {
    if (translated) {
      chrome.tabs.getSelected(null, (tab) => {
        chrome.tabs.sendMessage(tab.id, {
          action: this.messageType(translated),
          data: translated.outerHTML,
          success: !translated.classList.contains('failTranslate')
        });
      });
    }
  }

  messageType(translated) {
    if (translated && translated.rows && translated.rows.length === 1) {
      return 'similar_words';
    } else {
      return 'open_tooltip';
    }
  }

  fixImages(fragment) {
    fragment = fragment || null;
    this.fixUrl(fragment, 'img', 'src');
    return fragment;
  }

  fixLinks(fragment = null) {
    this.fixUrl(fragment, 'a', 'href');
    return fragment
  }


  fixUrl(fragment = null, tag, attr) {
    let elements = {};
    if (fragment) {
      elements = fragment.querySelectorAll(tag);
    }
    let parser = document.createElement('a');
    elements.forEach((el) => {
      parser.href = el[attr];
      parser.host = this.host;
      parser.protocol = this.protocol;
      // fix relative links
      if (tag == 'a') {
        el.classList.add('mtt_link');
        if (parser.pathname.indexOf('m.exe') !== -1) {
          parser.pathname = '/c' + parser.pathname;
          el.setAttribute('target', '_blank');
          el.setAttribute(attr, parser.href);
        }
      } else if (tag == 'img') {
        let url = this.getUrl(el.src);
        el.classList.add('mtt_img');
        el.src = `${this.protocol}://${this.host}/${url.pathname}`;
      }
    });
  }

  // todo: move to utils
  getUrl(url) {
    const a = document.createElement('a');
    a.href = url;
    return a;
  }
}

export default new Tran;