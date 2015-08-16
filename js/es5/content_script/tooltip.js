'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TOOLTIP_CLASS = '__mtt_translate_dialog__';
var ctrlDown = false;
var ctrlKey = 17;
var cmdKey = 91;
var cKey = 67;

var Tooltip = (function () {
  function Tooltip(coordinates) {
    _classCallCheck(this, Tooltip);

    this.setListeners();
    this.clickTarget = null;
  }

  _createClass(Tooltip, [{
    key: 'createEl',
    value: function createEl() {
      this.el = document.createElement('div');
      var self = this;
      chrome.storage.sync.get({ memorize: false }, function (items) {
        var tclass = TOOLTIP_CLASS;
        if (items.memorize) {
          tclass += ' memorize';
        }
        self.el.className = tclass;
        return true;
      });
      this.el.addEventListener('mousedown', function (e) {
        return e.stopPropagation();
      });
      this.el.addEventListener('keydown', this.onKeyDown);
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
      this.el.innerHTML = data;
      if (transform) {
        transform(this.el);
      }
      this.el.style.left = this.coordinates.mouseX + 'px';
      this.el.style.top = this.coordinates.mouseY + 'px';
      document.body.appendChild(this.el);
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
