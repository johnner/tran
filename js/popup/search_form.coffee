###
 Serves search input and form
 @param form
 @constructor
###
Dropdown = require('./dropdown.coffee')

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
      tran.search
        value: @input.value
        success: @successHandler.bind(@)

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

  inputHandler: (e) ->
    value = @input.value
    tran.request(
      url: url,
      success: params.success,
      error: params.error
    )



module.exports = SearchForm
