var _ = require('../utils.js');

class Options {
  constructor () {}

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

  check_login () {
    console.log('check login')
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

  memorize () {
    if (this.options.memorize) {
      _.get('http://tran-service.com').then(function (response) {
        console.log('success');
      },
      function (response) {
        console.log('error');
      });
      //if (this.check_login()) {
      //  need_sign
      //} else {
      //
      //}
    }
  }

  /** getter */
  get options () {
    return {
        language: document.getElementById('language').value,
        fast: document.getElementById('fast').checked,
        memorize: document.getElementById('memorize').checked
    }
  }

  /** setter */
  set options (values={}) {
      document.getElementById('language').value = values.language;
      document.getElementById('fast').checked = values.fast;
      document.getElementById('memorize').checked = values.memorize;
  }
}

var options = new Options();

document.addEventListener('DOMContentLoaded', evt => options.restore(evt));
document.getElementById('save').addEventListener('click', evt => options.save());
document.getElementById('memorize').addEventListener('click', evt=>options.memorize())