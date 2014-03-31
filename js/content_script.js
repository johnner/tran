/*global chrome*/
(function(){
  "use strict";
  /*lo-dash debounce and throttle http://lodash.com */
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
      el.className = '__mtt_translate_dialog__';
      return el;
    },

    setListeners: function () {
      document.body.addEventListener('click', this.destroy.bind(this));
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
      this.el.parentNode.removeChild(this.el);
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