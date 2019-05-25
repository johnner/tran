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
    this.hideSpinner();
    this.contentEl = document.getElementById('content')
    this.form = document.querySelector('form');
    this.addListeners();
    // TODO: update to UI KIT element
    this.dropdown = new Dropdown({
      el: document.querySelector('.dropdown-el'),
      onSelect: () => this.search()
    });
  }

  addListeners() {
    if (this.form && this.contentEl) {

      this.form.addEventListener('submit', (e) => this.search(e));
      this.contentEl.addEventListener('click', (e) => this.onContentClick(e));
    }
  }

  search(e) {
    e && e.preventDefault && e.preventDefault()

    if (this.input.value.length > 0) {
      this.clean(this.contentEl);
      this.showSpinner();
      // choose engine and search for translation (by default english-multitran)
      chrome.storage.sync.get({ language: '1', dictionary: 'multitran' }, (items) => {
        TRANSLATE_ENGINES[items.dictionary].search({
          value: this.input.value,
          success: (res) => this.successHandler(res)
        });
      });
    }
  }

  successHandler(response) {
    this.hideSpinner();
    this.contentEl.appendChild(response)
  }

  clean(el) {
    while (el.lastChild) {
      el.removeChild(el.lastChild);
    }
  }

  onContentClick(e) {
    e.preventDefault();
    const linkTags = ['A', 'a'];
    if (linkTags.includes(e.target.tagName)) {
      this.input.value = e.target.innerText;
      this.search(e);
    }
  }

  getValue() {
    return this.input.value;
  }

  showSpinner() {
    this.spinner.style.display = 'inline-block';
  }

  hideSpinner() {
    this.spinner.style.display = 'none';
  }
}

export default SearchForm;
