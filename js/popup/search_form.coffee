###
  Serves search input and form

  @param form DOM elemnt
  @constructor
###
Dropdown = require('./dropdown.coffee')

#translate engines
tran = require('../tran.coffee')
turkishdictionary = require('../turkishdictionary.js')


#Translate engines
TRANSLATE_ENGINES =
  'multitran': tran
  'turkish': turkishdictionary

class SearchForm
  constructor: (@form) ->
    @input = document.getElementById('translate-txt')
    @input.focus()

    @result = document.getElementById('result')
    @addListeners();
    @dropdown = new Dropdown({
      el: document.querySelector('.dropdown-el'),
      onSelect: => @search()
    });

  addListeners: ->
    if @form and @result
      @form.addEventListener 'submit', (e) => @search(e)
      @result.addEventListener 'click', (e) => @resultClickHandler(e)

  search: (e) ->
    e && e.preventDefault && e.preventDefault()
    if @input.value.length > 0
      #choose engine and search for translation (by default english-multitran)
      chrome.storage.sync.get({language: '1', dictionary: 'multitran'}, (items) =>
        console.log('ITEMS:', items);
        TRANSLATE_ENGINES[items.dictionary].search
          value: @input.value
          success: @successHandler.bind(@)
      )

  successHandler: (response) ->
      @clean(@result)
      @result.appendChild(response)

  clean: (el) ->
    while (el.lastChild)
      el.removeChild(el.lastChild)

  resultClickHandler: (e) ->
    e.preventDefault();
    linkTags = ['A', 'a']
    if e.target.tagName in linkTags
      @input.value = e.target.innerText;
      @search(e)

  getValue: ->
    return @input.value

  # inputHandler: (e) ->
  #   chrome.storage.sync.get({language: '1', dictionary: 'multitran'}, (items) =>
  #     TRANSLATE_ENGINES[items.dictionary].request
  #       value: @input.value
  #       success: @successHandler.bind(@)
  #       error: params.error
  #   )
    # value = @input.value
    # tran.request(
    #   url: url,
    #   success: params.success,
    #   error: params.error
    # )



module.exports = SearchForm
