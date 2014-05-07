TOOLTIP_CLASS = '__mtt_translate_dialog__v-0-3'

class Tooltip
  constructor: (@pageData) ->
    @setListeners()
    @clickTarget = {}

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
    @el.style.left = @pageData.mouseX + 'px';
    @el.style.top = @pageData.mouseY + 'px';
    document.body.appendChild(@el);

  destroy: ->
    if @el and @el.parentNode is document.body
      document.body.removeChild(@el)
      @el = null
      clickTarget = null # reset clicktarget

  setPageData: (pageData) ->
    @pageData = pageData

module.exports = Tooltip