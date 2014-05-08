TOOLTIP_CLASS = '__mtt_translate_dialog__v-0-3'

class Tooltip
  constructor: (@coordinates) ->
    @setListeners()
    @clickTarget = null

  createEl: ->
    @el = document.createElement('div');
    @el.className = TOOLTIP_CLASS;
    @el.addEventListener 'mousedown', (e) -> e.stopPropagation()

  setListeners: ->
    window.addEventListener 'mousedown', (e) => @destroy(e)
    document.addEventListener 'mousedown', (e) => @destroy(e)
    window.addEventListener 'blur', (e) => @destroy(e)
    window.addEventListener 'keydown', (e) => @destroy(e)
    document.addEventListener 'keydown', (e) => @destroy(e)

  render: (data) ->
    if not @el
      @createEl()
    @el.innerHTML = data;
    @el.style.left = @coordinates.mouseX + 'px';
    @el.style.top = @coordinates.mouseY + 'px';
    document.body.appendChild(@el);

  destroy: ->
    if @el and @el.parentNode is document.body
      document.body.removeChild(@el)
      @el = null
      @clickTarget = null # reset clicktarget

  setCoordinates: (coordinates) ->
    @coordinates = coordinates

module.exports = Tooltip