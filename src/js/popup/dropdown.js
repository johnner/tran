const LANG_CODE = {
  '1': 'Eng',
  '2': 'Rus',
  '3': 'Ger',
  '4': 'Fre',
  '5': 'Spa',
  '23': 'Ita',
  '24': 'Dut',
  '26': 'Est',
  '27': 'Lav',
  '31': 'Afr',
  '34': 'Epo',
  '35': 'Xal',
  '1000': 'Tur'
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
    this.el = opts.el || document.createElement('div');
    // onSelect handler set by aggregate class
    this.onSelect = opts.onSelect;
    this.menu = this.el.querySelector('.dropdown-menu');
    if (this.menu) {
      this.menu.style.display = 'none';
      this.items = this.menu.getElementsByClassName('language-type');
      this.button = this.el.querySelector('.dropdown-toggle');
      this.addListeners();
      this.initLanguage();
    }
  }

  addListeners() {
    this.button.addEventListener('click', (e) => this.toggle(e));
    document.addEventListener('click', (e) => this.hide(e));
    this.menu.addEventListener('click', (e) => this.choose(e));
  }

  // On init trying to get current language from storage or using default (1: english)
  initLanguage() {
    chrome.storage.sync.get({ language: '1' }, (store) => {
      this.setTitle(store.language);
    });
  }

  toggle(e) {
    e.stopPropagation()
    this.setActiveItem();
    if (this.menu && this.menu.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  }

  // Read current language from Chrome Storage and color active line
  setActiveItem() {
    chrome.storage.sync.get({ language: '1' }, (store) => {
      for (const item of this.items) {
        if (item.getAttribute('data-val') === store.language) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      }
    });
  }

  hide() {
    this.menu.style.display = 'none';
  }

  show() {
    this.menu.style.display = 'block';
  }

  // Saves chosen language to chrome.storage and decide which dictionary to use
  // Then called onSelect handler of the container class
  choose(e) {
    e.stopPropagation()
    e.preventDefault()
    const language = e.target.getAttribute('data-val');
    const dictionary = this.getDictionary(language);
    chrome.storage.sync.set({
      language: language,
      dictionary: dictionary
    },
      () => this.onSelect());
    this.setTitle(language);
    this.hide();
  }

  // Some languages are not present in multitran(e.g.turkish)
  // so we choose another service
  getDictionary(lang) {
    const dict = DICT_CODE[lang] || 'multitran';
    return dict;
  }

// Set current language label
  setTitle(language) {
    const html = LANG_CODE[language] + ' <span class="caret"></span>';
    this.button.innerHTML = html;
  }
}

export default Dropdown