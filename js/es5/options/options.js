'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('../utils.js');
//var SERVICE_URL = 'http://tran-service.com/user/';
var SERVICE_URL = 'http://localhost:5000/api/user/';

var Options = (function () {
  function Options() {
    _classCallCheck(this, Options);

    this.signed = document.getElementById('signed');
    this.needSign = document.getElementById('need-sign');
  }

  /** Restores select box and checkbox state using
   * the preferences stored in chrome.storage.*/

  _createClass(Options, [{
    key: 'restore',
    value: function restore() {
      // Use default value language is 'english' and fast translate is true
      var defaults = {
        language: '1',
        fast: true,
        memorize: false
      };
      this.storage('get', defaults, this.onRestore);
    }

    /** Saves options to chrome.storage */
  }, {
    key: 'save',
    value: function save() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? { restored: false } : arguments[0];

      // save options if only it is not restored onload
      if (!params.restored) {
        this.storage('set', this.options, this.onSave);
      }
    }
  }, {
    key: 'onSave',
    value: function onSave() {
      // let user know that options are saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      var hideStatus = function hideStatus() {
        status.textContent = '';
      };
      setTimeout(hideStatus, 750);
    }

    /** Handler of success options restore */
  }, {
    key: 'onRestore',
    value: function onRestore(items) {
      // set checkboxes
      this.options = items;
      this.memorize();
      this.save({ restored: true });
    }

    /** chrome storage wrapper */
  }, {
    key: 'storage',
    value: function storage(op, data, cb) {
      cb = cb.bind(this);
      if (op == 'set') {
        chrome.storage.sync.set(data, function (evt) {
          return cb(evt);
        });
      } else if (op == 'get') {
        chrome.storage.sync.get(data, function (evt) {
          return cb(evt);
        });
      }
    }

    /** toggle memorize option */
  }, {
    key: 'memorize',
    value: function memorize() {
      var _this = this;

      if (this.options.memorize) {
        this.check_auth().then(function (res) {
          return _this.authorized = true;
        }, function (res) {
          return _this.authorized = false;
        });
      } else {
        this.signed.classList.add('hidden');
        this.needSign.classList.add('hidden');
      }
    }
  }, {
    key: 'check_login',
    value: function check_login() {
      var _this2 = this;

      _.get(SERVICE_URL).then(function (res) {
        return _this2.memok(res);
      }, function (res) {
        return _this2.memfail(res);
      });
    }

    /** memorization is activated */
  }, {
    key: 'memok',
    value: function memok(response) {
      this.authorized = true;
    }

    /** memorization failed */
  }, {
    key: 'memfail',
    value: function memfail(response) {
      this.authorized = false;
    }
  }, {
    key: 'check_auth',
    value: function check_auth() {
      return new Promise((function (resolve, reject) {
        this.storage('get', 'auth_token', (function (data) {
          if (!data.auth_token) {
            reject();
          } else {
            _.get(SERVICE_URL, { headers: { 'X-AUTH-TOKEN': data.auth_token } }).then(function (res) {
              return resolve(res);
            }, function (res) {
              return reject(res);
            });
          }
        }).bind(this));
      }).bind(this));
    }
  }, {
    key: 'signin',
    value: function signin() {
      var _this3 = this;

      var cred = {
        login: document.getElementById('login').value,
        password: document.getElementById('password').value
      };

      _.post(SERVICE_URL, { data: cred }).then(function (res) {
        return _this3.authSuccess(res);
      }, function (res) {
        return _this3.authFail(res);
      });
    }
  }, {
    key: 'authSuccess',
    value: function authSuccess(data) {
      this.storage('set', { 'auth_token': data }, function (data) {
        return function (data) {};
      });
      this.authorized = true;
    }
  }, {
    key: 'authFail',
    value: function authFail(data) {
      console.log('fail auth', data);
      var status = document.querySelector('.error-login');
      status.textContent = 'Bad login or password.';
      var hideStatus = function hideStatus() {
        status.textContent = '';
      };
      setTimeout(hideStatus, 2750);
    }
  }, {
    key: 'revoke',
    value: function revoke(event) {
      event.preventDefault();
      this.storage('set', { 'auth_token': null }, (function (data) {
        this.authorized = false;
      }).bind(this));
    }
  }, {
    key: 'options',
    get: function get() {
      return {
        language: document.getElementById('language').value,
        fast: document.getElementById('fast').checked,
        memorize: document.getElementById('memorize').checked
      };
    },
    set: function set() {
      var values = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      document.getElementById('language').value = values.language;
      document.getElementById('fast').checked = values.fast;
      document.getElementById('memorize').checked = values.memorize;
    }
  }, {
    key: 'authorized',
    set: function set() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (state) {
        this.signed.classList.remove('hidden');
        this.needSign.classList.add('hidden');
      } else {
        this.needSign.classList.remove('hidden');
        this.signed.classList.add('hidden');
      }
    }
  }]);

  return Options;
})();

var options = new Options();

document.addEventListener('DOMContentLoaded', function (evt) {
  return options.restore();
});
document.getElementById('save').addEventListener('click', function (evt) {
  return options.save();
});
document.getElementById('memorize').addEventListener('click', function (evt) {
  return options.memorize();
});
document.getElementById('signinBtn').addEventListener('click', function (evt) {
  return options.signin();
});
document.querySelector('#revoke').addEventListener('click', function (evt) {
  return options.revoke(evt);
});
//# sourceMappingURL=options.js.map
