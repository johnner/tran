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
  '35': 'Xal',
  '1000': 'Tur'

DICT_CODE =
  '1': 'multitran'
  '1000': 'turkish'

class Dropdown
  constructor: (opts) ->
    @el = opts.el or document.createElement('div')
    # onSelect handler set by aggregate class
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

  # On init trying to get current language from storage or using default( 1:english)
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
    chrome.storage.sync.get {language: '1'}, (store) =>
      for item in @items
        if item.getAttribute('data-val') == store.language
          item.classList.add('active')
        else
          item.classList.remove('active')

  hide: ->
    @menu.style.display = 'none'

  show: ->
    @menu.style.display = 'block'

  # Saves chosen language to chrome.storage and decide which dictionary to use
  # Then called onSelect handler of the container class
  choose: (e) ->
    e.stopPropagation()
    e.preventDefault()
    language = e.target.getAttribute('data-val')
    dictionary = @getDictionary(language)
    chrome.storage.sync.set({language: language, dictionary: dictionary}, @onSelect)
    @setTitle(language)
    @hide()

  # Some languages are not present in multitran (e.g. turkish)
  # so we choose another service
  getDictionary: (lang) ->
    console.log('choose dict: for',lang);
    dict = DICT_CODE[lang] || 'multitran'
    console.log('dict',dict)
    return dict

  #Set current language label
  setTitle: (language) ->
    html = LANG_CODE[language] + ' <span class="caret"></span>'
    @button.innerHTML = html


module.exports = Dropdown