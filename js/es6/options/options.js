var _ = require('../utils.js');
var SERVICE_URL = 'http://tran-service.com/api/user/';

class Options {
  constructor () {
    this.signed = document.getElementById('signed');
    this.needSign = document.getElementById('need-sign');
  }

  /** Restores select box and checkbox state using
   * the preferences stored in chrome.storage.*/
  restore () {
    // Use default value language is 'english' and fast translate is true
    var defaults = {
      language: '1',
      fast: true,
      memorize: false
    };
    this.storage('get', defaults, this.onRestore);
  }

  /** Saves options to chrome.storage */
  save (params={restored:false}) {
    // save options if only it is not restored onload
    if (!params.restored) {
      this.storage('set', this.options, this.onSave)
    } else {
      this.memorize();
    }
  }

  onSave () {
    // let user know that options are saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    let hideStatus = function () { status.textContent = ''};
    this.memorize();
    setTimeout(hideStatus, 750);
  }

  /** Handler of success options restore */
  onRestore (items) {
      // set checkboxes
      this.options = items;
      this.save({restored:true})
  }

  /** chrome storage wrapper */
  storage (op, data, cb) {
    cb = cb.bind(this)
    if (op == 'set') {
      chrome.storage.sync.set(data, evt => cb(evt));
    } else if (op == 'get') {
      chrome.storage.sync.get(data, evt => cb(evt));
    }
  }

  /** toggle memorize option */
  memorize () {
    if (this.options.memorize) {
      this.check_auth().then(
        res => this.authorized = true,
        res => this.authorized = false
    )
    } else {
      this.revoke();
      this.signed.classList.add('hidden');
      this.needSign.classList.add('hidden');
    }
  }

  check_login () {
    _.get(SERVICE_URL).then(
      res => this.memok(res),
      res => this.memfail(res)
    );
  }

  /** memorization is activated */
  memok (response) {
    this.authorized = true;
  }

  /** memorization failed */
  memfail (response) {
      this.authorized = false;
  }

  get options () {
    return {
        language: document.getElementById('language').value,
        fast: document.getElementById('fast').checked,
        memorize: document.getElementById('memorize').checked
    }
  }

  set options (values) {
      document.getElementById('language').value = values.language;
      document.getElementById('fast').checked = values.fast;
      document.getElementById('memorize').checked = values.memorize;
  }

  set authorized (state) {
    if (this.options.memorize) {
      if (state) {
        this.signed.classList.remove('hidden');
        this.needSign.classList.add('hidden');
      } else {
        this.needSign.classList.remove('hidden');
        this.signed.classList.add('hidden');
      }
    }
  }

  check_auth () {
    return new Promise(function(resolve, reject) {
      this.storage('get', 'auth_token', function (data) {
        if (!data.auth_token) {
          reject();
        } else {
          _.get(SERVICE_URL, {headers:{'X-AUTH-TOKEN': data.auth_token}}).then(
            res => resolve(res),
            res => reject(res)
          )
        }
      }.bind(this));
    }.bind(this));
  }

  signin () {
    var cred = {
      login: document.getElementById('login').value,
      password: document.getElementById('password').value
    }

    _.post(SERVICE_URL, {data:cred}).then(
      res => this.authSuccess(res),
      res => this.authFail(res)
    )
  }

  authSuccess(data) {
    this.storage('set', {'auth_token': data}, data => this.save());
    this.authorized = true;
  }

  authFail (data) {
    console.log('fail auth', data);
    var status = document.querySelector('.error-login')
    status.textContent = 'Bad login or password.'
    let hideStatus = function () { status.textContent = ''}
    setTimeout(hideStatus, 2750);
  }

  revoke (event) {
    event && event.preventDefault();
    this.storage('set', {'auth_token': null}, function (data) {
      this.authorized = false;
    }.bind(this));
  }
}

document.addEventListener('DOMContentLoaded', function(event) {
  var options = new Options();
  options.restore();
  document.getElementById('save').addEventListener('click', evt=> options.save());
  document.getElementById('memorize').addEventListener('click', evt=> options.memorize());
  document.getElementById('signinBtn').addEventListener('click', evt=> options.signin());
  document.querySelector('#revoke').addEventListener( 'click', evt=> options.revoke(evt))
});
