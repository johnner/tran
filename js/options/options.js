"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _ = require("../utils.js");

var Options = (function () {
  function Options() {}

  _prototypeProperties(Options, null, {
    restore: {

      /** Restores select box and checkbox state using
       * the preferences stored in chrome.storage.*/
      value: function restore() {
        // Use default value language is 'english' and fast translate is true
        var defaults = {
          language: "1",
          fast: true,
          memorize: false
        };
        this.storage("get", defaults, this.onRestore);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    save: {

      /** Saves options to chrome.storage */
      value: function save() {
        var params = arguments[0] === undefined ? { restored: false } : arguments[0];
        // save options if only it is not restored onload
        if (!params.restored) {
          this.storage("set", this.options, this.onSave);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    check_login: {
      value: function checkLogin() {
        console.log("check login");
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    onSave: {
      value: function onSave() {
        // let user know that options are saved.
        var status = document.getElementById("status");
        status.textContent = "Options saved.";
        var hideStatus = function () {
          status.textContent = "";
        };
        setTimeout(hideStatus, 750);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    onRestore: {

      /** Handler of success options restore */
      value: function onRestore(items) {
        // set checkboxes
        this.options = items;
        this.save({ restored: true });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    storage: {

      /** chrome storage wrapper */
      value: function storage(op, data, cb) {
        cb = cb.bind(this);
        if (op == "set") {
          chrome.storage.sync.set(data, function (evt) {
            return cb(evt);
          });
        } else if (op == "get") {
          chrome.storage.sync.get(data, function (evt) {
            return cb(evt);
          });
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    memorize: {
      value: function memorize() {
        if (this.options.memorize) {
          _.get("http://tran-service.com").then(function (response) {
            console.log("success");
          }, function (response) {
            console.log("error");
          });
          //if (this.check_login()) {
          //  need_sign
          //} else {
          //
          //}
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    options: {

      /** getter */
      get: function () {
        return {
          language: document.getElementById("language").value,
          fast: document.getElementById("fast").checked,
          memorize: document.getElementById("memorize").checked
        };
      },


      /** setter */
      set: function () {
        var values = arguments[0] === undefined ? {} : arguments[0];
        document.getElementById("language").value = values.language;
        document.getElementById("fast").checked = values.fast;
        document.getElementById("memorize").checked = values.memorize;
      },
      enumerable: true,
      configurable: true
    }
  });

  return Options;
})();

var options = new Options();

document.addEventListener("DOMContentLoaded", function (evt) {
  return options.restore(evt);
});
document.getElementById("save").addEventListener("click", function (evt) {
  return options.save();
});
document.getElementById("memorize").addEventListener("click", function (evt) {
  return options.memorize();
});