import Vue from 'vue'
import Dropdown from './dropdown.js';
import tran from '../tran.js';
import turkishdictionary from '../turkishdictionary.js';


// Translate engines
const TRANSLATE_ENGINES = {
  'multitran': tran,
  'turkish': turkishdictionary
}

/*
  Serves search input and form
  @constructor
*/
class SearchForm {

  constructor() {
    this.input = document.getElementById('translate-txt')
    this.input.focus();
    this.spinner = document.querySelector('.spinner');
    this._spinnerDisplay = this.spinner.style.display;
    this.hideSpinner();
    this.contentEl = document.getElementById('content')
    this.form = document.querySelector('form');
    this.addListeners();

    this.dropdown = new Dropdown({
      el: document.querySelector('.dropdown-menu'),
      button: document.querySelector('.select-language > button'),
      onSelect: () => this.search()
    });

    this.vm = new Vue({
      el: '#content',
      data: {
        seen: false,
        headers: []
      },
      methods: {
        onClickMeaning: (e) => {this.onClickMeaning(e);}
      }
    });

    const clipboard = this.getClipboard();
    if (clipboard) {
      this.input.value = clipboard;
      this.search();
    }
  }

  getClipboard() {
    //Create a textbox field where we can insert text to.
    var pasteText = document.createElement("textarea")
    document.body.appendChild(pasteText);
    pasteText.focus();
    document.execCommand('paste');
    const value = pasteText.value;
    pasteText.remove();
    return value;
  }

  addListeners() {
    if (this.form && this.contentEl) {
      this.form.addEventListener('submit', (e) => this.search(e));
    }
  }

  search(e) {
    e && e.preventDefault && e.preventDefault();

    if (this.input.value.length > 0) {
      // this.clean(this.contentEl);
      this.vm.headers = [];
      this.showSpinner();
      // choose engine and search for translation (by default english-multitran)
      chrome.storage.sync.get({ language: '1', dictionary: 'multitran' }, (items) => {
        TRANSLATE_ENGINES[items.dictionary].search({
          value: this.input.value,
          success: (res) => this.successHandler(res, items.dictionary)
        });
      });
    }
  }

  successHandler(response) {
    this.hideSpinner();
    this.vm.seen = true;
    this.vm.headers = response ? response.headers : [];
  }

  getValue() {
    return this.input.value;
  }

  showSpinner() {
    this.spinner.style.display = this._spinnerDisplay;
  }

  hideSpinner() {
    this.spinner.style.display = 'none';
  }

  onClickMeaning(e) {
    e.preventDefault();
    console.log('=clicked', e);
  }
}

export default SearchForm;
