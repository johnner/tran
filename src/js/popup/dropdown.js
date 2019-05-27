const LANG_CODE = {
  '1': 'Английский',
  '2': 'Русский',
  '3': 'Немецкий',
  '4': 'Французский',
  '5': 'Испанский',
  '23': 'Итальянский',
  '24': 'Нидерландский',
  '26': 'Эстонский',
  '27': 'Латышский',
  '34': 'Эсперанто',
  '1000': 'Турецкий'
}

const DICT_CODE = {
  '1': 'multitran',
  '1000': 'turkish'
}


/*
  Dropdown language menu
  example:
  new Dropdown({
   el: document.getElementById('#menu');
   onSelect: function () {}
  })
*/
class Dropdown {
  constructor(opts) {
    this.el = opts.el;
    this.button = opts.button;
    this.onSelect = opts.onSelect || function () { };
    this.items = this.el.getElementsByTagName('A');
    this.addListeners();
    this.setActiveItem();
  }

  addListeners() {
    this.el.addEventListener('click', (event) => {
      const target = event.target;
      if (target.tagName !== 'A') return;
      this.onItemClick(target);
    });
  }

  onItemClick(itemEl) {
    event.preventDefault();
    const languageId = itemEl.getAttribute('data-val');
    this.selectLanguage(languageId);

  }

  // On init trying to get current language from storage or using default (1: english)
  initLanguage() {
    chrome.storage.sync.get({ language: '1' }, (store) => {
      this.setTitle(store.language);
    });
  }

  // Read current language from Chrome Storage and color active line
  setActiveItem() {
    chrome.storage.sync.get({ language: '1' }, (store) => {
      this.setTitle(store.language);
      for (const item of this.items) {
        if (item.getAttribute('data-val') === store.language) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      }
    });
  }

  // Saves chosen language to chrome.storage and decide which dictionary to use
  // Then called onSelect handler of the container class
  selectLanguage(languageId) {
    const dictionary = this.getSourceDictionary(languageId);
    chrome.storage.sync.set(
      {
        language: languageId,
        dictionary: dictionary
      },
      () => this.onSelect()
    );
    this.setTitle(languageId);
    this.hide();
  }

  // Some languages are not present in multitran(e.g.turkish)
  // so we choose another service
  getSourceDictionary(lang) {
    const dict = DICT_CODE[lang] || 'multitran';
    return dict;
  }

  // Set current language label
  setTitle(languageId) {
    const html = LANG_CODE[languageId];
    this.button.innerHTML = html;
  }
}

export default Dropdown