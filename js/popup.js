/*global tran*/
var Dropdown = function (el) {
  this.el = el;
  this.button = el.querySelector('.dropdown-toggle');
  this.menu = el.querySelector('.dropdown-menu');
  this.menu.style.display = 'none';
  this.items = this.menu.getElementsByClassName('language-type');
  this.addListeners();
};

Dropdown.prototype = {
  addListeners: function () {
    this.button.addEventListener('click', this.toggle.bind(this));
    document.addEventListener('click', this.hide.bind(this));
    this.menu.addEventListener('click', this.choose.bind(this));
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
        if (item.getAttribute('data-val') == store.language) {
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
    chrome.storage.sync.set({
      language: language
    });
    this.hide();
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
};

Search.prototype = {
  addListeners: function () {
    this.form.addEventListener('submit', this.search.bind(this));
    this.result.addEventListener('click', this.resultClickHandler.bind(this));
  },

  search: function (e) {
    e.preventDefault();
    tran.search(this.input.value, this.successHandler.bind(this));
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
  }
};

document.addEventListener("DOMContentLoaded", function onDom() {
  var dropdown = new Dropdown(document.querySelector('.dropdown-el'));
  var form = new Search(document.getElementById('tran-form'));
});
