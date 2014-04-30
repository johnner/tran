/*global chrome*/
/**
 * Script that is embedded on each user page
 * Listens messages from translation module and renders popup
 * with translated text
 */
(function(){
  'use strict';
  var TEXTBOX_TAGS = ['input', 'textarea'];
  var TOOLTIP_CLASS = '__mtt_translate_dialog__v-0-3';
  var clickTarget;

  var pageData = {
      mouseX: 0,
      mouseY: 0
  };

  var Tooltip = function () {
    this.setListeners();
  };

  Tooltip.prototype = {
    createEl: function () {
      var el = document.createElement('div');
      el.className = TOOLTIP_CLASS;
      this.el = el;
      this.el.addEventListener('click', function (e) { e.stopPropagation(); });
      return el;
    },

    setListeners: function () {
      window.addEventListener('click', this.destroy.bind(this));
			document.addEventListener('click', this.destroy.bind(this));
      window.addEventListener('blur', this.destroy.bind(this));
      window.addEventListener('keypress', this.destroy.bind(this));
    },

    render: function (data) {
      if (!this.el) {
        this.createEl();
      }
      this.el.innerHTML = data;
      this.el.style.left = pageData.mouseX + 'px';
      this.el.style.top = pageData.mouseY + 'px';
      document.body.appendChild(this.el);
    },

    destroy: function () {
      if (this.el && this.el.parentNode == document.body) {
        document.body.removeChild(this.el);
        this.el = null;
        clickTarget = null; // reset clicktarget
      }
    }

  };

  function main () {
    function saveMousePosition (e) {
      pageData.mouseX = e.pageX + 5;
      pageData.mouseY = e.pageY + 10;
    }
    document.addEventListener('contextmenu', saveMousePosition);
    var tooltip = new Tooltip();

    chrome.runtime.onMessage.addListener(function (msg) {
      if (msg.action === 'open_tooltip') {
        //don't show annoying tooltip when typing
        if (!msg.success && clickTarget == 'textbox') {
          return;
        }
        tooltip.render(msg.data);
      }
      return true;
    });

    window.addEventListener('mousedown', mouseDownEvent);
    document.addEventListener('mousedown', mouseDownEvent);
    window.addEventListener('mouseup', mouseUpEvent);

    function mouseDownEvent (e) {
      var tag = e.target.tagName.toLowerCase();
      if (TEXTBOX_TAGS.indexOf(tag) > -1) {
        clickTarget = 'textbox';
      }
    }

    function mouseUpEvent (e) {
      //fix for accidental tooltip appearance when clicked on text
			setTimeout(function () {
				saveMousePosition(e);
				var selection = window.getSelection().toString();
				if (selection.length > 0) {
					chrome.runtime.sendMessage({method: "get_fast_option"}, function(response) {
						//if fast translation option is active
            //then request translation for selection
						if (response.fast) {
							chrome.runtime.sendMessage({
								method: "request_search",
								data: {selectionText: selection}
							});
						}
					});
				}
			}, 10);
    }
  }

  main();
})();