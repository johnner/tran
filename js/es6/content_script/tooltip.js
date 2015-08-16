var TOOLTIP_CLASS = '__mtt_translate_dialog__'
var ctrlDown = false
var ctrlKey = 17;
var cmdKey = 91;
var cKey = 67;

class Tooltip {
  constructor (coordinates) {
    this.setListeners();
    this.clickTarget = null;
  }

  createEl () {
    this.el = document.createElement('div');
    self = this;
    chrome.storage.sync.get({ memorize: false}, function (items) {
      var tclass = TOOLTIP_CLASS;
      if (items.memorize) {
        tclass += ' memorize';
      }
      self.el.className = tclass;
      return true;
    });
    this.el.addEventListener('mousedown', e => e.stopPropagation());
    this.el.addEventListener('keydown', this.onKeyDown);

  }
  onKeyDown (e) {
    if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) {
      e.stopPropagation()
      return true;
    }
  }
  setListeners () {
    window.addEventListener('mousedown', e => this.destroy(e))
    document.addEventListener('mousedown', e => this.destroy(e))
    window.addEventListener('blur', e => this.destroy(e))
    document.addEventListener('keydown', e => this.keydown(e))
    document.addEventListener('keyup', e => this.keyup(e))
  }
  render (data, transform = null) {
    if (!this.el) {
      this.createEl();
    }
    this.el.innerHTML = data;
    if (transform) { transform(this.el) }
    this.el.style.left = this.coordinates.mouseX + 'px';
    this.el.style.top = this.coordinates.mouseY + 'px';
    document.body.appendChild(this.el);
  }

  keydown (e) {
    if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
      ctrlDown = true;
    }
    if (ctrlDown && (e.keyCode == ctrlKey || e.keyCode == cKey || e.keyCode == cmdKey)) {
      return true;
    } else {
      this.destroy(e);
    }
  }

  keyup (e) {
    if (e.keyCode == ctrlKey) {
      ctrlDown = false;
    }
  }

  destroy (e) {
    if (this.el && this.el.parentNode == document.body) {
      document.body.removeChild(this.el);
      this.el = null;
      this.clickTarget = null  // reset click target
    }
  }

  setCoordinates (coordinates) {
    this.coordinates = coordinates;
  }
}

module.exports = Tooltip