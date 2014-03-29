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
    this.el = document.createElement('div');
    this.setListeners();
  };
  Dialog.prototype = {
    setListeners: function () {
      var self = this;
      document.body.addEventListener('click', function (e) {
        self.el.style.display = 'none';
      });
    },
    render: function (data) {
      var div = this.el;
      div.className = '__mtt_translate_dialog__';
      div.innerHTML = data;
      document.body.appendChild(div);
      div.style.left = cs.mouseX + 'px';
      div.style.top = cs.mouseY + 'px';
      div.addEventListener('click', function (e) {
         e.stopPropagation();
      });
    }
  };

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === 'open_dialog_box') {
      var dialog = new Dialog();
      dialog.render(msg.data);
    }
    return true;
  });


})();