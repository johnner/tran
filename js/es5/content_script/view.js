"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Tooltip = require("./tooltip.js");
var TEXTBOX_TAGS = ["input", "textarea"];

var Main = (function () {
  function Main() {
    var _this = this;
    window.addEventListener("mousedown", function (e) {
      return _this.mouseDownEvent(e);
    });
    document.addEventListener("mousedown", function (e) {
      return _this.mouseDownEvent(e);
    });
    window.addEventListener("mouseup", function (e) {
      return _this.mouseUpEvent(e);
    });
    document.addEventListener("contextmenu", function (e) {
      return _this.saveMousePosition(e);
    });
    this.coordinates = { mouseX: 0, mouseY: 0 };

    this.tooltip = new Tooltip(this.coordinates);

    chrome.runtime.onMessage.addListener(function (msg) {
      if (msg.action == "open_tooltip" || msg.action == "similar_words") {
        //don't show annoying tooltip when typing
        if (!msg.success && this.tooltip.clickTarget == "textbox") {
          return;
        } else if (msg.action == "similar_words") {
          this.tooltip.render(msg.data, this.attachSimilarWordsHandlers);
        } else {
          this.tooltip.render(msg.data);
        }
      }
    });
  }

  _prototypeProperties(Main, null, {
    requestSearch: {
      value: function requestSearch(selection) {
        chrome.runtime.sendMessage({
          method: "request_search",
          data: {
            selectionText: selection
          }
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    saveMousePosition: {
      value: function saveMousePosition(e) {
        this.coordinates.mouseX = e.pageX + 5;
        this.coordinates.mouseY = e.pageY + 10;
        this.tooltip.setCoordinates(this.coordinates);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    mouseDownEvent: {
      value: function mouseDownEvent(e) {
        var tag = e.target.tagName.toLowerCase();
        if (TEXTBOX_TAGS.indexOf(tag) != -1) {
          this.tooltip.clickTarget = "textbox";
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    mouseUpEvent: {
      value: function mouseUpEvent(e) {
        // fix for accidental tooltip appearance when clicked on text
        handler = function () {
          this.saveMousePosition(e);
          selection = this.getSelection();
          if (selection.length > 0) {
            chrome.storage.sync.get({ fast: true }, function (items) {
              if (items.fast) {
                this.requestSearch(selection);
              }
            });
          }
        };
        setTimeout(handler, 10);
        return true;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    getSelection: {
      value: function getSelection(e) {
        var txt = window.getSelection().toString();
        var span = document.createElement("SPAN");
        span.innerHTML = txt;
        var selection = span.textContent.trim();
        return selection;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    attachSimilarWordsHandlers: {
      value: function attachSimilarWordsHandlers(fragment) {
        var _this2 = this;
        for (var _iterator = fragment.querySelectorAll("a")[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
          (function () {
            var link = _step.value;
            // sanitize
            link.removeAttribute("onclick");
            link.onclick = null;
            var clone = link.cloneNode(true);
            link.parentNode.replaceChild(clone, link);
            var word = clone.textContent;
            // Prevent link from being followed.
            clone.addEventListener("click", function (e) {
              e.stopPropagation();e.preventDefault();
            });
            // Don't let @mouseUpEvent fire again with the wrong word.
            self = _this2;
            clone.addEventListener("mouseup", function (e) {
              e.stopPropagation();
              self.requestSearch(word);
            });
          })();
        }

        return true;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Main;
})();

module.exports = Main;