var _ = require('../utils.js');
var SERVICE_URL = 'http://tran-service.com/user/';

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
    }
    this.storage('get', defaults, this.onRestore);
  }

  /** Saves options to chrome.storage */
  save (params={restored:false}) {
    // save options if only it is not restored onload
    if (!params.restored) {
      this.storage('set', this.options, this.onSave)
    }
  }

  onSave () {
    // let user know that options are saved.
    var status = document.getElementById('status')
    status.textContent = 'Options saved.'
    let hideStatus = function () { status.textContent = ''}
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
      this.check_login();
    } else {
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

  set options (values={}) {
      document.getElementById('language').value = values.language;
      document.getElementById('fast').checked = values.fast;
      document.getElementById('memorize').checked = values.memorize;
  }

  set authorized (state=false) {
    if (state) {
      this.signed.classList.remove('hidden');
      this.needSign.classList.add('hidden');
    } else {
      this.needSign.classList.remove('hidden');
      this.signed.classList.add('hidden');
    }
  }

}

var options = new Options();

document.addEventListener('DOMContentLoaded', evt=> options.restore());
document.getElementById('save').addEventListener('click', evt=> options.save());
document.getElementById('memorize').addEventListener('click', evt=> options.memorize());