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
    if (this.menu.style.display == 'none') {
      this.show();
    } else {
      this.hide();
    }
  },
  hide: function (e) {
    this.menu.style.display = 'none';
  },
  show: function (e) {
    this.menu.style.display = 'block';
  },
  choose: function (e) {
    e.stopPropagation();
  }
};

document.addEventListener("DOMContentLoaded", function onDom(evt) {
  var dropdown = new Dropdown(document.querySelector('.dropdown-toggle'));
});
