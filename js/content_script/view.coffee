Tooltip = require('./tooltip.coffee')
TEXTBOX_TAGS = ['input', 'textarea']

class Main
  constructor: ->
    window.addEventListener 'mousedown', (e) => @mouseDownEvent(e)
    document.addEventListener 'mousedown', (e) => @mouseDownEvent(e)
    window.addEventListener 'mouseup', (e) => @mouseUpEvent(e)
    document.addEventListener 'contextmenu', (e) => @saveMousePosition(e)
    @pageData =
      mouseX: 0,
      mouseY: 0
    @tooltip = tooltip = new Tooltip(@pageData);

    chrome.runtime.onMessage.addListener (msg) =>
      if msg.action == 'open_tooltip'
        #don't show annoying tooltip when typing
        if not msg.success and @tooltip.clickTarget is 'textbox'
          return
        else
          @tooltip.render(msg.data)
      return true

  saveMousePosition: (e) ->
    @pageData.mouseX = e.pageX + 5
    @pageData.mouseY = e.pageY + 10
    @tooltip.setPageData(@pageData)

  mouseDownEvent: (e) ->
    tag = e.target.tagName.toLowerCase()
    if tag in TEXTBOX_TAGS
      @tooltip.clickTarget = 'textbox'

  mouseUpEvent: (e) ->
    # fix for accidental tooltip appearance when clicked on text
    handler = =>
      @saveMousePosition(e)
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

module.exports = Main