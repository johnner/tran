/*
  Translation engine: http://www.turkishdictionary.net
  For translating turkish-russian and vice versa
*/
var CHAR_CODES = require('./char-codes-turk.js');

class TurkishDictionary {
  constructor() {
  	this.host = 'http://www.turkishdictionary.net/?word=%FC';
  	this.path = '';
    this.protocol = 'http'
    this.query = '&s='
    this.TABLE_CLASS = '___mtt_translate_table';
    this.need_publish = true;
  }

  search (data) {
    data.url = this.makeUrl(data.value);
    this.need_publish = false;
    return this.request(data);
  }

  translate(data) {
    console.log('request data:', data);
    data.url = this.makeUrl(data.selectionText);
    this.need_publish = true;
    this.request(data);
  }

  makeUrl (text) {
    return ['http://www.turkishdictionary.net/?word=', text].join('');
  }

  /*
    Request translation and run callback function
    passing translated result or error to callback
  */
  request (opts) {
    console.log('start request');
    this.xhr = new XMLHttpRequest();
    this.xhr.onreadystatechange = this.onReadyStateChange.bind(this, opts);
    this.xhr.open("GET", opts.url, true);
    this.xhr.send();
  }

  onReadyStateChange (opts, e) {
      let xhr = this.xhr;
      if (xhr.readyState < 4) {
        return;
      }
      else if (xhr.status != 200) {
        this.errorHandler(xhr);
        return opts.error && opts.error();
      } else if (xhr.readyState == 4) {
        let translation = this.successHandler(e.target.response);
        console.log('success turkish translate', translation);
        console.log('call', opts.success);
        return opts.success && opts.success(translation);
      }
  }

  successHandler (response) {
    var data = this.parse(response);
    if (this.need_publish) {
      chrome.tabs.getSelected(null, this.publishTranslation.bind(this, data));
    }
    return data;
  }

  /* publish successfuly translated text all over extension */
  publishTranslation (translation, tab) {
    console.log('publish translation');
    chrome.tabs.sendMessage(tab.id, {
      action: 'open_tooltip',
      data: translation.outerHTML,
      success: !translation.classList.contains('failTranslate')
    });
  }

  errorHandler (response) {
    console.log('error ajax', response);
  }

  /* Parse response from translation engine */
  parse (response, silent, translate) {
    var doc = this.stripScripts(response),
        fragment = this.makeFragment(doc);
    if (fragment) {
      translate = fragment.querySelector('#meaning_div > table');
      if (translate) {
        translate.className = this.TABLE_CLASS;
        translate.setAttribute("cellpadding", "5");
        // @fixImages(translate)
        // @fixLinks(translate)
      } else if (!silent) {
        translate = document.createElement('div')
        translate.className = 'failTranslate';
        translate.innerText = "Unfortunately, could not translate";
      }
    }
    return translate;
  }

  //TODO extract to base engine class
  /* removes <script> tags from html code */
  stripScripts (html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    var scripts = div.getElementsByTagName('script');
    let i = scripts.length;
    while (i--)
      scripts[i].parentNode.removeChild(scripts[i]);
    return div.innerHTML;
  }

  //TODO extract to base engine class
  /* creates temp object to parse translation from page 
    (since it's not a friendly api) 
  */
  makeFragment (html) {
    var fragment,
        div = document.createElement("div");
    div.innerHTML = html;
    fragment = document.createDocumentFragment();
    while ( div.firstChild ) {
      fragment.appendChild( div.firstChild );
    }
    return fragment;
  }
}

// Singletone
module.exports = new TurkishDictionary();