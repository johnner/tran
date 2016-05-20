// TODO вынести настройки подключения в settings.js
//var HOST = 'http://tran-service.com'
var HOST = 'http://localhost:5000';

var TOOLTIP_CLASS_PREFIX = '__mtt_translate_dialog__';
var ctrlDown = false;
var ctrlKey = 17;
var cmdKey = 91;
var cKey = 67;
var add_title = 'Добавить в персональный словарь';

var _ = require('../utils.js');

class Tooltip {
  constructor (coordinates) {
    this.setListeners();
    this.clickTarget = null;
  }

  createEl (storage) {
    this.el = document.createElement('div');
    this.memorizeButton = this.createMemoBtn();
    this.elContainer = this.createContainer();
    this.el.appendChild(this.memorizeButton);
    this.el.appendChild(this.elContainer);
    this.el.classList.add(TOOLTIP_CLASS_PREFIX);
    this.addListeners();

  }

  addListeners () {
    this.el.addEventListener('mousedown', e => e.stopPropagation());
    this.el.addEventListener('keydown', this.onKeyDown);
    this.memorizeButton.addEventListener('click', this.memoClick);
  }

  createMemoBtn () {
    var t = document.createElement('template');
    var tmpl = `<a title="${add_title}"
                   class="btn-floating waves-effect waves-light blue word-add">
                  <i class="material-icons">+</i>
                </a>`;
    t.innerHTML = tmpl;
    return t.content;
  }

  memoClick (e) {
    e.stopPropagation();
    e.preventDefault();
    _.post(HOST+'/api/plugin/add_word/', {data: 'blabla'});
  }

  createContainer () {
    var docFragment = document.createDocumentFragment();
    var container = document.createElement('div');
    container.classList.add(TOOLTIP_CLASS_PREFIX + 'container');
    return container;
  }

  onKeyDown (e) {
    if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) {
      e.stopPropagation();
      return true;
    }
  }

  setListeners () {
    window.addEventListener('mousedown', e => this.destroy(e));
    document.addEventListener('mousedown', e => this.destroy(e));
    window.addEventListener('blur', e => this.destroy(e));
    document.addEventListener('keydown', e => this.keydown(e));
    document.addEventListener('keyup', e => this.keyup(e));
  }

  render (data, transform = null) {
      if (!this.el) {
        this.createEl();
      }
      this.checkMemorize();
      this.elContainer.innerHTML = data;
      if (transform) { transform(this.el) }
      this.el.style.left = this.coordinates.mouseX + 'px';
      this.el.style.top = this.coordinates.mouseY + 'px';
      document.body.appendChild(this.el);
      if (this.coordinates.mouseX + this.el.offsetWidth > window.innerWidth) {
        this.el.style.left = (this.coordinates.mouseX - this.el.offsetWidth) + 'px';
      }
  }

  checkMemorize () {
    var self = this;
    chrome.storage.sync.get({memorize: false, auth_token: null}, function (storage) {
      if (storage.memorize && storage.auth_token) {
        self.el.classList.add('memorize');
      } else {
        self.el.classList.remove('memorize');
      }
    });
  }

  keydown (e) {
    if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
      ctrlDown = true;
    }
    if (ctrlDown && (e.keyCode == ctrlKey || e.keyCode == cKey || e.keyCode == cmdKey)) {
      return true;
    } else {
      this.destroy(e);
    }
  }

  keyup (e) {
    if (e.keyCode == ctrlKey) {
      ctrlDown = false;
    }
  }

  destroy (e) {
    if (this.el && this.el.parentNode == document.body) {
      document.body.removeChild(this.el);
      this.el = null;
      this.clickTarget = null;  // reset click target
    }
  }

  setCoordinates (coordinates) {
    this.coordinates = coordinates;
  }
}

module.exports = Tooltip;