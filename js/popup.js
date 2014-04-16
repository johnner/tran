/*global tran*/
var Dropdown = function (el) {
  this.el = el;
  this.menu = document.querySelector('.dropdown-menu');
  this.menu.style.display = 'none';
  this.addListeners();
};

Dropdown.prototype = {
  addListeners: function () {
    this.el.addEventListener('click', this.toggle.bind(this));
    document.addEventListener('click', this.hide.bind(this));
    this.menu.addEventListener('click', this.choose.bind(this));
  },
  toggle: function (e) {
    e.stopPropagation();
    if (this.menu.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  },
  hide: function () {
    this.menu.style.display = 'none';
  },
  show: function () {
    this.menu.style.display = 'block';
  },
  choose: function (e) {
    e.stopPropagation();
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
  url: 'http://www.multitran.ru/c/m.exe',
  params: '?l1=1&l2=2&s=',

  addListeners: function () {
    this.form.addEventListener('submit', this.search.bind(this));
    this.result.addEventListener('click', this.resultClickHandler.bind(this));
  },

  search: function (e) {
    if (e) { e.preventDefault(); }
    var xhr = this.xhr = new XMLHttpRequest();
    xhr.onreadystatechange = this.successHandler.bind(this); // Implemented elsewhere.
    xhr.open("GET", this.url + this.params + this.input.value, true);
    xhr.send();
  },

  successHandler: function (e) {
    var xhr = this.xhr;
    if(xhr.readyState < 4) { return; }
    if(xhr.status !== 200) { return; }
    if(xhr.readyState === 4) {
      var translate = tran.parse(e.target.response);
      this.clean(this.result);
      this.result.appendChild(translate);
    }
  },

  clean: function (el) {
    while (el.lastChild) {
      el.removeChild(el.lastChild);
    }
  },

  resultClickHandler: function (e) {
    e.preventDefault();
    if (e.target.tagName === 'A' || e.target.tagName === 'a') {
      var href = e.target.getAttribute('href');
      this.input.value = e.target.innerText;
      this.search(e);
    }
  }
};

document.addEventListener("DOMContentLoaded", function onDom() {
  var dropdown = new Dropdown(document.querySelector('.dropdown-toggle'));
  var form = new Search(document.getElementById('tran-form'));
});
