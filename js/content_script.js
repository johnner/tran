/*global chrome*/
/**
 * Script that is embedded on each user page
 * Listens messages from translation module and renders popup
 * with translated text
 */
(function(){
  "use strict";

  var DIALOG_CLASS = "__mtt_translate_dialog__v-0-3";
  var pageData = {
      mouseX: 0,
      mouseY: 0
  };

  var Dialog = function () {
    this.el = this.createEl();
    this.setListeners();
  };

  Dialog.prototype = {
    createEl: function () {
      var el = document.createElement('div');
      el.className = DIALOG_CLASS;
      return el;
    },

    setListeners: function () {
      window.addEventListener('click', this.destroy.bind(this));
			document.addEventListener('click', this.destroy.bind(this));
      window.addEventListener('blur', this.destroy.bind(this));
      this.el.addEventListener('click', function (e) { e.stopPropagation(); });
    },

    render: function (data) {
      this.el.innerHTML = data;
      this.el.style.left = pageData.mouseX + 'px';
      this.el.style.top = pageData.mouseY + 'px';
      document.body.appendChild(this.el);
    },

    destroy: function () {
      if (this.el.parentNode == document.body) {
        document.body.removeChild(this.el);
      }
    }
  };

  function main () {
    function saveMousePosition (e) {
      pageData.mouseX = e.pageX + 5;
      pageData.mouseY = e.pageY + 10;
    }
    document.addEventListener('contextmenu', saveMousePosition);

    chrome.runtime.onMessage.addListener(function (msg) {
      if (msg.action === 'open_dialog_box') {
        var dialog = new Dialog();
        dialog.render(msg.data);
      }
      return true;
    });

    window.addEventListener('mouseup', mouseUpEvent);

    function mouseUpEvent (e) {
			setTimeout(function () {
				saveMousePosition(e);
				var selection = window.getSelection().toString();
				if (selection.length > 0) {
					chrome.runtime.sendMessage({method: "get_fast_option"}, function(response) {
						//if quick selection search is active
						if (response.fast) {
							//read selection and request translation
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