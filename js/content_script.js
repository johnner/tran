/*global chrome*/
(function(){
  "use strict";

  var DIALOG_CLASS = "__mtt_translate_dialog__v-0-3";
  var cs = {
    mouseX: 0,
    mouseY: 0
  };
  function mouseHandler (e) {
    cs.mouseX = e.pageX;
    cs.mouseY = e.pageY;
  }
  document.addEventListener('contextmenu', mouseHandler);
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
      window.addEventListener('blur', this.destroy.bind(this));
      this.el.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    },

    render: function (data) {
      this.el.innerHTML = data;
      this.el.style.left = cs.mouseX + 'px';
      this.el.style.top = cs.mouseY + 'px';
      document.body.appendChild(this.el);
    },

    destroy: function () {
      if (this.el.parentNode == document.body) {
        document.body.removeChild(this.el);
      }
    }
  };

  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.action === 'open_dialog_box') {
      var dialog = new Dialog();
      dialog.render(msg.data);
    }
    return true;
  });


})();