'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Tooltip = require('./tooltip.js');
var TEXTBOX_TAGS = ['input', 'textarea'];

var Main = (function () {
  function Main() {
    _classCallCheck(this, Main);

    this.addEventListeners();
    this.coordinates = { mouseX: 0, mouseY: 0 };
    this.tooltip = new Tooltip(this.coordinates);
    chrome.runtime.onMessage.addListener(this.renderResult.bind(this));
  }

  _createClass(Main, [{
    key: 'addEventListeners',
    value: function addEventListeners() {
      var _this = this;

      window.addEventListener('mousedown', function (e) {
        return _this.mouseDownEvent(e);
      });
      document.addEventListener('mousedown', function (e) {
        return _this.mouseDownEvent(e);
      });
      window.addEventListener('mouseup', function (e) {
        return _this.mouseUpEvent(e);
      });
      document.addEventListener('contextmenu', function (e) {
        return _this.saveMousePosition(e);
      });
    }
  }, {
    key: 'renderResult',
    value: function renderResult(msg) {
      if (msg.action == 'open_tooltip' || msg.action == 'similar_words') {
        //don't show annoying tooltip when typing
        if (!msg.success && this.tooltip.clickTarget == 'textbox') {
          return;
        } else if (msg.action == 'similar_words') {
          this.tooltip.render(msg.data, this.attachSimilarWordsHandlers.bind(this));
        } else {
          this.tooltip.render(msg.data);
        }
      }
    }
  }, {
    key: 'requestSearch',
    value: function requestSearch(selection) {
      chrome.runtime.sendMessage({
        method: "request_search",
        data: {
          selectionText: selection
        }
      });
    }
  }, {
    key: 'saveMousePosition',
    value: function saveMousePosition(e) {
      this.coordinates.mouseX = e.pageX + 5;
      this.coordinates.mouseY = e.pageY + 10;
      this.tooltip.setCoordinates(this.coordinates);
    }
  }, {
    key: 'mouseDownEvent',
    value: function mouseDownEvent(e) {
      var tag = e.target.tagName.toLowerCase();
      if (TEXTBOX_TAGS.indexOf(tag) != -1) {
        this.tooltip.clickTarget = 'textbox';
      }
    }
  }, {
    key: 'mouseUpEvent',
    value: function mouseUpEvent(e) {
      // fix for accidental tooltip appearance when clicked on text
      setTimeout(this.clickHandler.bind(this, e), 10);
      return true;
    }
  }, {
    key: 'clickHandler',
    value: function clickHandler(e) {
      this.saveMousePosition(e);
      var selection = this.getSelection();
      var self = this;
      if (selection.length > 0) {
        chrome.storage.sync.get({ fast: true }, function (items) {
          if (items.fast) {
            self.requestSearch(selection);
          }
        });
      }
    }
  }, {
    key: 'getSelection',
    value: function getSelection(e) {
      var txt = window.getSelection().toString();
      var span = document.createElement('SPAN');
      span.innerHTML = txt;
      var selection = span.textContent.trim();
      return selection;
    }
  }, {
    key: 'attachSimilarWordsHandlers',
    value: function attachSimilarWordsHandlers(fragment) {
      var _this2 = this;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function () {
          var link = _step.value;

          // sanitize
          link.removeAttribute('onclick');
          link.onclick = null;
          var clone = link.cloneNode(true);
          link.parentNode.replaceChild(clone, link);
          var word = clone.textContent;
          // Prevent link from being followed.
          clone.addEventListener('click', function (e) {
            e.stopPropagation();e.preventDefault();
          });
          // Don't let @mouseUpEvent fire again with the wrong word.
          self = _this2;

          clone.addEventListener('mouseup', function (e) {
            e.stopPropagation();
            self.requestSearch(word);
          });
        };

        for (var _iterator = Array.from(fragment.querySelectorAll('a'))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var self;

          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return true;
    }
  }]);

  return Main;
})();

module.exports = Main;
//# sourceMappingURL=view.js.map
