Tooltip = require('./tooltip.coffee')
TEXTBOX_TAGS = ['input', 'textarea']

class Main
  constructor: ->
    window.addEventListener 'mousedown', (e) => @mouseDownEvent(e)
    document.addEventListener 'mousedown', (e) => @mouseDownEvent(e)
    window.addEventListener 'mouseup', (e) => @mouseUpEvent(e)
    document.addEventListener 'contextmenu', (e) => @saveMousePosition(e)
    @coordinates =
      mouseX: 0
      mouseY: 0
    @tooltip = new Tooltip(@coordinates);

    chrome.runtime.onMessage.addListener (msg) =>
      if msg.action == 'open_tooltip' or msg.action == 'similar_words'
        #don't show annoying tooltip when typing
        if not msg.success and @tooltip.clickTarget is 'textbox'
          return
        else if msg.action is 'similar_words'
          @tooltip.render msg.data, @attachSimilarWordsHandlers.bind this
        else
          @tooltip.render(msg.data)
      return true

  requestSearch: (selection) ->
    chrome.runtime.sendMessage
      method: "request_search"
      data:
        selectionText: selection

  saveMousePosition: (e) ->
    @coordinates.mouseX = e.pageX + 5
    @coordinates.mouseY = e.pageY + 10
    @tooltip.setCoordinates(@coordinates)

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
        chrome.runtime.sendMessage method: "get_fast_option", (response) =>
          # if fast translation option is active
          # then request translation for selection
          if response.fast
            @requestSearch selection
          return true
    setTimeout handler, 10
    return true

  attachSimilarWordsHandlers: (fragment) ->
    for link in fragment.querySelectorAll 'a'
      do (word = link.textContent) =>
        # Prevent link from being followed.
        link.addEventListener 'click', (e) -> e.preventDefault()
        # Don't let @mouseUpEvent fire again with the wrong word.
        link.addEventListener 'mouseup', (e) =>
          e.stopPropagation()
          @requestSearch word
    return true

module.exports = Main
