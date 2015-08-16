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
          @tooltip.render msg.data, @attachSimilarWordsHandlers
        else
          @tooltip.render(msg.data)

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
      selection = @getSelection()
      if selection.length > 0
        chrome.storage.sync.get(fast: true, (items) =>
          if items.fast
            @requestSearch selection
        )
    setTimeout handler, 10
    return true

  getSelection: ->
      txt = window.getSelection().toString();
      span = document.createElement('SPAN')
      span.innerHTML = txt;
      selection = span.textContent.trim()
      return selection

  attachSimilarWordsHandlers: (fragment) =>
    for link in fragment.querySelectorAll 'a'
      # sanitize
      link.removeAttribute('onclick');
      link.onclick = null;
      clone = link.cloneNode(true);
      link.parentNode.replaceChild(clone, link);
      do (word = clone.textContent) =>
        # Prevent link from being followed.
        clone.addEventListener 'click', (e) ->
          e.stopPropagation();
          e.preventDefault();
        # Don't let @mouseUpEvent fire again with the wrong word.
        self = this
        clone.addEventListener 'mouseup', (e) =>
          e.stopPropagation()
          self.requestSearch word
    return true

module.exports = Main
