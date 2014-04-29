/*global tran, chrome*/
/**
 * Dropdown language menu
 * @param opts takes element and onSelect handler
 * example:
 * new Dropdown({
 *  el: document.getElementById('#menu');
 *  onSelect: function () {}
 * })
 */
var LANG_CODE = {
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
  '35': 'Xal'
}
var Dropdown = function (opts) {
  var el = this.el = opts.el;
  this.onSelect = opts.onSelect;
  this.button = el.querySelector('.dropdown-toggle');
  this.menu = el.querySelector('.dropdown-menu');
  this.menu.style.display = 'none';
  this.items = this.menu.getElementsByClassName('language-type');
  this.addListeners();
  this.initLanguage();
};

Dropdown.prototype = {
  addListeners: function () {
    this.button.addEventListener('click', this.toggle.bind(this));
    document.addEventListener('click', this.hide.bind(this));
    this.menu.addEventListener('click', this.choose.bind(this));
  },

  // Set language on popup init
  initLanguage: function () {
    var self = this;
    chrome.storage.sync.get({
      language: '1'
    }, function(store) {
      self.setTitle(store.language);
    });
  },

  toggle: function (e) {
    e.stopPropagation();
    this.setActiveItem();
    if (this.menu.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  },

  // Read current language from Chrome Storage and color active line
  setActiveItem: function () {
    var self = this;
    chrome.storage.sync.get({
      language: '1'
    }, function(store) {
      for (var i = 0; i < self.items.length; i ++) {
        var item = self.items[i];
        if (item.getAttribute('data-val') === store.language) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      }
    });
  },

  hide: function () {
    this.menu.style.display = 'none';
  },

  show: function () {
    this.menu.style.display = 'block';
  },

  choose: function (e) {
    e.stopPropagation();
    e.preventDefault();
    var language = e.target.getAttribute('data-val');
    chrome.storage.sync.set({language: language}, this.onSelect);
    this.setTitle(language);
    this.hide();
  },

  setTitle: function (language) {
    var html = LANG_CODE[language] + ' <span class="caret"></span>';
    this.button.innerHTML = html;
  }
};

/**
 * Serves search input and form
 * @param form
 * @constructor
 */
var Search = function (form) {
  this.form = form;
  this.input = document.getElementById('translate-txt');
  this.result = document.getElementById('result');
  this.addListeners();
  this.dropdown = new Dropdown({
    el: document.querySelector('.dropdown-el'),
    onSelect: this.search.bind(this)
  });
};

Search.prototype = {
  addListeners: function () {
    this.form.addEventListener('submit', this.search.bind(this));
    this.result.addEventListener('click', this.resultClickHandler.bind(this));
  },

  search: function (e) {
    e && e.preventDefault && e.preventDefault();
    if (this.input.value.length > 0) {
      tran.search(this.input.value, this.successHandler.bind(this));
    }
  },

  successHandler: function (response) {
      this.clean(this.result);
      this.result.appendChild(response);
  },

  clean: function (el) {
    while (el.lastChild) {
      el.removeChild(el.lastChild);
    }
  },

  resultClickHandler: function (e) {
    e.preventDefault();
    if (e.target.tagName === 'A' || e.target.tagName === 'a') {
      this.input.value = e.target.innerText;
      this.search(e);
    }
  },

  getValue: function () {
    return this.input.value;
  }
};

document.addEventListener("DOMContentLoaded", function onDom() {
  var form = new Search(document.getElementById('tran-form'));
  var link = document.getElementById('header-link');
  link.addEventListener('click', function (e) {
    e.preventDefault();
    var href = e.target.getAttribute('href') + form.getValue();
    chrome.tabs.create({ url: href });
  });
});
