TOOLTIP_CLASS = '__mtt_translate_dialog__'
ctrlDown = false
ctrlKey = 17;
cmdKey = 91;
cKey = 67;

class Tooltip
  constructor: (@coordinates) ->
    @setListeners()
    @clickTarget = null


  createEl: ->
    @el = document.createElement('div');

    self = this
    chrome.storage.sync.get({ memorize: false}, (items) ->
      tclass = TOOLTIP_CLASS
      if items.memorize
        tclass += ' memorize'
      self.el.className = tclass;
      return true
    )

    @el.addEventListener 'mousedown', (e) -> e.stopPropagation()
    @el.addEventListener 'keydown', (e) ->
      if ctrlDown and (e.keyCode == vKey or e.keyCode == cKey)
        e.stopPropagation()
        return true

  setListeners: ->
    window.addEventListener 'mousedown', (e) => @destroy(e)
    document.addEventListener 'mousedown', (e) => @destroy(e)
    window.addEventListener 'blur', (e) => @destroy(e)
#    window.addEventListener 'keydown', (e) => @keydown(e)
    document.addEventListener 'keydown', (e) => @keydown(e)
#    window.addEventListener 'keydown', (e) => @keydown(e)
    document.addEventListener 'keyup', (e) => @keyup(e)

  render: (data, transform = null) ->
    if not @el
      @createEl()
    @el.innerHTML = data;
    transform @el if transform?
    @el.style.left = @coordinates.mouseX + 'px';
    @el.style.top = @coordinates.mouseY + 'px';
    document.body.appendChild(@el);


  keydown: (e) ->
    if e.keyCode == ctrlKey or e.keyCode == cmdKey
      ctrlDown = true

    if ctrlDown and (e.keyCode == ctrlKey or e.keyCode == cKey or e.keyCode == cmdKey)
      return true
    else
      @destroy(e)

  keyup: (e) ->
    if e.keyCode == ctrlKey
      ctrlDown = false;


  destroy: (e) ->
    if @el and @el.parentNode is document.body
      document.body.removeChild(@el)
      @el = null
      @clickTarget = null # reset clicktarget

  setCoordinates: (coordinates) ->
    @coordinates = coordinates

module.exports = Tooltip