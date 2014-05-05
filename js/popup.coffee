### global tran, chrome ###
###
  Dropdown language menu
  @param opts takes element and onSelect handler
  example:
  new Dropdown({
   el: document.getElementById('#menu');
   onSelect: function () {}
  })
###

LANG_CODE =
  '1': 'Eng'
  '2': 'Rus'
  '3': 'Ger'
  '4': 'Fre'
  '5': 'Spa'
  '23': 'Ita'
  '24': 'Dut'
  '26': 'Est'
  '27': 'Lav'
  '31': 'Afr'
  '34': 'Epo'
  '35': 'Xal'

class Dropdown
  constructor: (opts) ->
    @el = opts.el or document.createElement('div')
    @onSelect = opts.onSelect
    @menu = @el.querySelector('.dropdown-menu')
    if @menu
      @menu.style.display = 'none'
      @items = @menu.getElementsByClassName('language-type')
      @button = @el.querySelector('.dropdown-toggle')
      @addListeners()
      @initLanguage()

  addListeners: ->
    @button.addEventListener 'click', (e) => @toggle(e)
    document.addEventListener 'click', (e) => @hide(e)
    @menu.addEventListener 'click', (e) => @choose(e)

  # Set language on popup init
  initLanguage: ->
    chrome.storage.sync.get({ language: '1'}, (store) =>
      @setTitle(store.language);
    )

  toggle: (e) ->
    e.stopPropagation()
    @setActiveItem()
    if @menu and @menu.style.display is 'none'
      @show()
    else
      @hide()

  # Read current language from Chrome Storage and color active line
  setActiveItem: ->
    chrome.storage.sync.get({language: '1'}, (store) =>
      for item in @items
        if item.getAttribute('data-val') == store.language
          item.classList.add('active')
        else
          item.classList.remove('active')
    )

  hide: ->
    @menu.style.display = 'none'

  show: ->
    @menu.style.display = 'block'

  choose: (e) ->
    e.stopPropagation()
    e.preventDefault()
    language = e.target.getAttribute('data-val')
    chrome.storage.sync.set({language: language}, @onSelect)
    @setTitle(language)
    @hide()

  setTitle: (language) ->
    html = LANG_CODE[language] + ' <span class="caret"></span>'
    @button.innerHTML = html

###
 Serves search input and form
 @param form
 @constructor
###
class Search
  constructor: (@form) ->
    @input = document.getElementById('translate-txt')
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
    e && e.preventDefault && e.preventDefault();
    if @input.value.length > 0
      tran.search(@input.value, @successHandler.bind(@))

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

document.addEventListener("DOMContentLoaded", ->
  form = new Search(document.getElementById('tran-form'))
  link = document.getElementById('header-link')
  if link
    link.addEventListener('click', (e) ->
      e.preventDefault();
      href = e.target.getAttribute('href') + form.getValue()
      chrome.tabs.create({ url: href })
    )
)
