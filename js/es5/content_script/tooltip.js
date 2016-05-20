// TODO вынести настройки подключения в settings.js
//var HOST = 'http://tran-service.com'
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var HOST = 'http://localhost:5000';

var TOOLTIP_CLASS_PREFIX = '__mtt_translate_dialog__';
var ctrlDown = false;
var ctrlKey = 17;
var cmdKey = 91;
var cKey = 67;
var add_title = 'Добавить в персональный словарь';

var _ = require('../utils.js');

var Tooltip = (function () {
  function Tooltip(coordinates) {
    _classCallCheck(this, Tooltip);

    this.setListeners();
    this.clickTarget = null;
  }

  _createClass(Tooltip, [{
    key: 'createEl',
    value: function createEl(storage) {
      this.el = document.createElement('div');
      this.memorizeButton = this.createMemoBtn();
      this.elContainer = this.createContainer();
      this.el.appendChild(this.memorizeButton);
      this.el.appendChild(this.elContainer);
      this.el.classList.add(TOOLTIP_CLASS_PREFIX);
      this.addListeners();
    }
  }, {
    key: 'addListeners',
    value: function addListeners() {
      this.el.addEventListener('mousedown', function (e) {
        return e.stopPropagation();
      });
      this.el.addEventListener('keydown', this.onKeyDown);
      this.memorizeButton.addEventListener('click', this.memoClick);
    }
  }, {
    key: 'createMemoBtn',
    value: function createMemoBtn() {
      var t = document.createElement('template');
      var tmpl = '<a title="' + add_title + '"\n                   class="btn-floating waves-effect waves-light blue word-add">\n                  <i class="material-icons">+</i>\n                </a>';
      t.innerHTML = tmpl;
      return t.content;
    }
  }, {
    key: 'memoClick',
    value: function memoClick(e) {
      e.stopPropagation();
      e.preventDefault();
      _.post(HOST + '/api/plugin/add_word/', { data: 'blabla' });
    }
  }, {
    key: 'createContainer',
    value: function createContainer() {
      var docFragment = document.createDocumentFragment();
      var container = document.createElement('div');
      container.classList.add(TOOLTIP_CLASS_PREFIX + 'container');
      return container;
    }
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) {
        e.stopPropagation();
        return true;
      }
    }
  }, {
    key: 'setListeners',
    value: function setListeners() {
      var _this = this;

      window.addEventListener('mousedown', function (e) {
        return _this.destroy(e);
      });
      document.addEventListener('mousedown', function (e) {
        return _this.destroy(e);
      });
      window.addEventListener('blur', function (e) {
        return _this.destroy(e);
      });
      document.addEventListener('keydown', function (e) {
        return _this.keydown(e);
      });
      document.addEventListener('keyup', function (e) {
        return _this.keyup(e);
      });
    }
  }, {
    key: 'render',
    value: function render(data) {
      var transform = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (!this.el) {
        this.createEl();
      }
      this.checkMemorize();
      this.elContainer.innerHTML = data;
      if (transform) {
        transform(this.el);
      }
      this.el.style.left = this.coordinates.mouseX + 'px';
      this.el.style.top = this.coordinates.mouseY + 'px';
      document.body.appendChild(this.el);
      if (this.coordinates.mouseX + this.el.offsetWidth > window.innerWidth) {
        this.el.style.left = this.coordinates.mouseX - this.el.offsetWidth + 'px';
      }
    }
  }, {
    key: 'checkMemorize',
    value: function checkMemorize() {
      var self = this;
      chrome.storage.sync.get({ memorize: false, auth_token: null }, function (storage) {
        if (storage.memorize && storage.auth_token) {
          self.el.classList.add('memorize');
        } else {
          self.el.classList.remove('memorize');
        }
      });
    }
  }, {
    key: 'keydown',
    value: function keydown(e) {
      if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
        ctrlDown = true;
      }
      if (ctrlDown && (e.keyCode == ctrlKey || e.keyCode == cKey || e.keyCode == cmdKey)) {
        return true;
      } else {
        this.destroy(e);
      }
    }
  }, {
    key: 'keyup',
    value: function keyup(e) {
      if (e.keyCode == ctrlKey) {
        ctrlDown = false;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy(e) {
      if (this.el && this.el.parentNode == document.body) {
        document.body.removeChild(this.el);
        this.el = null;
        this.clickTarget = null; // reset click target
      }
    }
  }, {
    key: 'setCoordinates',
    value: function setCoordinates(coordinates) {
      this.coordinates = coordinates;
    }
  }]);

  return Tooltip;
})();

module.exports = Tooltip;
//# sourceMappingURL=tooltip.js.map
