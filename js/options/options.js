"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _ = require("../utils.js");
//var SERVICE_URL = 'http://tran-service.com/user/';
var SERVICE_URL = "http://localhost:5000/api/user/";

var Options = (function () {
  function Options() {
    this.signed = document.getElementById("signed");
    this.needSign = document.getElementById("need-sign");
  }

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

      /** toggle memorize option */
      value: function memorize() {
        var _this = this;
        if (this.options.memorize) {
          this.check_auth().then(function (res) {
            return _this.authorized = true;
          }, function (res) {
            return _this.authorized = false;
          });
        } else {
          this.signed.classList.add("hidden");
          this.needSign.classList.add("hidden");
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    check_login: {
      value: function checkLogin() {
        var _this2 = this;
        _.get(SERVICE_URL).then(function (res) {
          return _this2.memok(res);
        }, function (res) {
          return _this2.memfail(res);
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    memok: {

      /** memorization is activated */
      value: function memok(response) {
        this.authorized = true;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    memfail: {

      /** memorization failed */
      value: function memfail(response) {
        this.authorized = false;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    options: {
      get: function () {
        return {
          language: document.getElementById("language").value,
          fast: document.getElementById("fast").checked,
          memorize: document.getElementById("memorize").checked
        };
      },
      set: function () {
        var values = arguments[0] === undefined ? {} : arguments[0];
        document.getElementById("language").value = values.language;
        document.getElementById("fast").checked = values.fast;
        document.getElementById("memorize").checked = values.memorize;
      },
      enumerable: true,
      configurable: true
    },
    authorized: {
      set: function () {
        var state = arguments[0] === undefined ? false : arguments[0];
        if (state) {
          this.signed.classList.remove("hidden");
          this.needSign.classList.add("hidden");
        } else {
          this.needSign.classList.remove("hidden");
          this.signed.classList.add("hidden");
        }
      },
      enumerable: true,
      configurable: true
    },
    check_auth: {
      value: function checkAuth() {
        return new Promise((function (resolve, reject) {
          this.storage("get", "auth_token", (function (data) {
            if (!data.auth_token) {
              reject();
            } else {
              _.get(SERVICE_URL, { headers: { "X-AUTH-TOKEN": data.auth_token } }).then(function (res) {
                return resolve(res);
              }, function (res) {
                return reject(res);
              });
            }
          }).bind(this));
        }).bind(this));
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    signin: {
      value: function signin() {
        var _this3 = this;
        var cred = {
          login: document.getElementById("login").value,
          password: document.getElementById("password").value
        };

        _.post(SERVICE_URL, { data: cred }).then(function (res) {
          return _this3.authSuccess(res);
        }, function (res) {
          return _this3.authFail(res);
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    authSuccess: {
      value: function authSuccess(data) {
        this.storage("set", { auth_token: data }, function (data) {
          return function (data) {};
        });
        this.authorized = true;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    authFail: {
      value: function authFail(data) {
        console.log("fail auth", data);
        var status = document.querySelector(".error-login");
        status.textContent = "Bad login or password.";
        var hideStatus = function () {
          status.textContent = "";
        };
        setTimeout(hideStatus, 2750);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    revoke: {
      value: function revoke(event) {
        event.preventDefault();
        this.storage("set", { auth_token: null }, (function (data) {
          this.authorized = false;
        }).bind(this));
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Options;
})();

var options = new Options();

document.addEventListener("DOMContentLoaded", function (evt) {
  return options.restore();
});
document.getElementById("save").addEventListener("click", function (evt) {
  return options.save();
});
document.getElementById("memorize").addEventListener("click", function (evt) {
  return options.memorize();
});
document.getElementById("signinBtn").addEventListener("click", function (evt) {
  return options.signin();
});
document.querySelector("#revoke").addEventListener("click", function (evt) {
  return options.revoke(evt);
});