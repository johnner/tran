### global chrome ###
###
 Script that is embedded on each user page
 Listens messages from translation module and renders popup
 with translated text
###

do ->
  TEXTBOX_TAGS = ['input', 'textarea']
  TOOLTIP_CLASS = '__mtt_translate_dialog__v-0-3'
  clickTarget = {}

  pageData =
      mouseX: 0,
      mouseY: 0

  class Tooltip
    constructor: ->
      this.setListeners()

    createEl: ->
      this.el = document.createElement('div');
      this.el.className = TOOLTIP_CLASS;
      this.el.addEventListener 'click', (e) -> e.stopPropagation()

    setListeners: ->
      window.addEventListener 'mousedown', => @destroy()
      document.addEventListener 'mousedown', => @destroy()
      window.addEventListener 'blur', => @destroy()
      window.addEventListener 'keydown', => @destroy()

    render: (data) ->
      if not this.el
        this.createEl()
      this.el.innerHTML = data;
      this.el.style.left = pageData.mouseX + 'px';
      this.el.style.top = pageData.mouseY + 'px';
      document.body.appendChild(this.el);

    destroy: ->
      if this.el and this.el.parentNode is document.body
        document.body.removeChild(this.el)
        this.el = null
        clickTarget = null # reset clicktarget

  class main
    constructor: ->
      window.addEventListener('mousedown', mouseDownEvent);
      document.addEventListener('mousedown', mouseDownEvent);
      window.addEventListener('mouseup', mouseUpEvent);
      document.addEventListener('contextmenu', saveMousePosition)
      tooltip = new Tooltip();

      chrome.runtime.onMessage.addListener (msg) ->
        if msg.action == 'open_tooltip'
          #don't show annoying tooltip when typing
          if not msg.success and clickTarget is 'textbox'
            return
          else
            tooltip.render(msg.data)
        return true

    saveMousePosition = (e) ->
      pageData.mouseX = e.pageX + 5
      pageData.mouseY = e.pageY + 10

    mouseDownEvent = (e) ->
      tag = e.target.tagName.toLowerCase()
      if tag in TEXTBOX_TAGS
        clickTarget = 'textbox'

    mouseUpEvent = (e) ->
      # fix for accidental tooltip appearance when clicked on text
      handler = ->
        saveMousePosition(e)
        selection = window.getSelection().toString()
        if selection.length > 0
          chrome.runtime.sendMessage method: "get_fast_option", (response) ->
            # if fast translation option is active
            # then request translation for selection
            if response.fast
              chrome.runtime.sendMessage
                method: "request_search"
                data:
                  selectionText: selection
            return true
      setTimeout handler, 10
      return true

  new main();