"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var TOOLTIP_CLASS = "__mtt_translate_dialog__";
var ctrlDown = false;
var ctrlKey = 17;
var cmdKey = 91;
var cKey = 67;

var Tooltip = (function () {
  function Tooltip(coordinates) {
    this.setListeners();
    this.clickTarget = null;
  }

  _prototypeProperties(Tooltip, null, {
    createEl: {
      value: function createEl() {
        this.el = document.createElement("div");
        self = this;
        chrome.storage.sync.get({ memorize: false }, function (items) {
          var tclass = TOOLTIP_CLASS;
          if (items.memorize) {
            tclass += " memorize";
          }
          self.el.className = tclass;
          return true;
        });
        this.el.addEventListener("mousedown", function (e) {
          return e.stopPropagation();
        });
        this.el.addEventListener("keydown", this.onKeyDown);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    onKeyDown: {
      value: function onKeyDown(e) {
        if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) {
          e.stopPropagation();
          return true;
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    setListeners: {
      value: function setListeners() {
        var _this = this;
        window.addEventListener("mousedown", function (e) {
          return _this.destroy(e);
        });
        document.addEventListener("mousedown", function (e) {
          return _this.destroy(e);
        });
        window.addEventListener("blur", function (e) {
          return _this.destroy(e);
        });
        document.addEventListener("keydown", function (e) {
          return _this.keydown(e);
        });
        document.addEventListener("keyup", function (e) {
          return _this.keyup(e);
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    render: {
      value: function render(data) {
        var transform = arguments[1] === undefined ? null : arguments[1];
        if (!this.el) {
          this.createEl();
        }
        this.el.innerHTML = data;
        if (transform) {
          transform(this.el);
        }
        this.el.style.left = this.coordinates.mouseX + "px";
        this.el.style.top = this.coordinates.mouseY + "px";
        document.body.appendChild(this.el);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    keydown: {
      value: function keydown(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
          ctrlDown = true;
        }
        if (ctrlDown && (e.keyCode == ctrlKey || e.keyCode == cKey || e.keyCode == cmdKey)) {
          return true;
        } else {
          this.destroy(e);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    keyup: {
      value: function keyup(e) {
        if (e.keyCode == ctrlKey) {
          ctrlDown = false;
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    destroy: {
      value: function destroy(e) {
        if (this.el && this.el.parentNode == document.body) {
          document.body.removeChild(this.el);
          this.el = null;
          this.clickTarget = null // reset click target
          ;
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    setCoordinates: {
      value: function setCoordinates(coordinates) {
        this.coordinates = coordinates;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Tooltip;
})();

module.exports = Tooltip;