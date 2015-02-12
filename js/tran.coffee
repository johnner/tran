###global chrome###
###
  Multitran.ru translate engine
  Provides program interface for making translate queries to multitran and get clean response

  All engines must follow common interface and provide methods:
    - search (languange, successHandler)  clean translation must be passed into successHandler
    - click

  Translation-module that makes requests to language-engine,
  parses results and sends plugin-global message with translation data
###

CHAR_CODES = require('./char-codes.js');

class Tran
  constructor: ->
    @TABLE_CLASS = "___mtt_translate_table"
    @protocol = 'http'
    @host = 'www.multitran.ru'
    @path = '/c/m.exe'
    @query = '&s='
    @lang = '?l1=2&l2=1' #from russian to english by default
    @xhr = {}

  ###
    Context menu click handler
  ###
  click: (data) ->
    if typeof data.silent == undefined || data.silent == null
      data.silent = true # true by default
    selectionText = @removeHyphenation data.selectionText
    @search
        value: selectionText
        success: @successtHandler.bind(this)
        silent: data.silent  # if translation failed do not show dialog

  ###
    Discard soft hyphen character (U+00AD, &shy;) from the input
  ###
  removeHyphenation: (text) ->
    text.replace /\xad/g, ''

  ###
    Initiate translation search
  ###
  search: (params) ->
    #value, callback, err
    chrome.storage.sync.get({language: '1'}, (items) =>
      if language is ''
        language = '1'
      @setLanguage(items.language)
      url = @makeUrl(params.value);
      # decorate success to make preliminary parsing
      origSuccess = params.success
      params.success = (response) =>
        translated = @parse(response, params.silent)
        origSuccess(translated)

      # make request (GET request with query parameters in url)
      @request(
        url: url,
        success: params.success,
        error: params.error
      )
    )

  setLanguage: (language) ->
    @currentLanguage = language
    @lang = '?l1=2&l2=' + language

  ###
    Request translation and run callback function
    passing translated result or error to callback
  ###
  request: (opts) ->
    xhr = @xhr = new XMLHttpRequest()
    xhr.onreadystatechange = (e) =>
      xhr = @xhr
      if xhr.readyState < 4
        return
      else if xhr.status != 200
        @errorHandler(xhr)
        if (typeof opts.error == 'function')
          opts.error()
        return
      else if xhr.readyState == 4
          return opts.success(e.target.response)

    xhr.open("GET", opts.url, true);
    xhr.send();


  makeUrl: (value) ->
    url = [@protocol, '://',
              @host,
              @path,
              @lang,
              @query,
              @getEncodedValue(value)
          ].join('')

    return url;

  # Replace special language characters to html codes
  getEncodedValue: (value) ->
    # to find spec symbols we first encode them (raw search for that symbol doesn't wor)
    val = encodeURIComponent(value)
    for char, code of CHAR_CODES
      if typeof code == 'object'
        # russian has special codes
        cc = code.val
      else
        # for all langs except russian encode html-codes needed
        # для всех остальных языков
        cc = encodeURIComponent(code)
      val = val.replace(char, cc)
    return val

  errorHandler: (xhr) ->
    console.log('error', xhr)

  ###
   Receiving data from translation-engine and send ready message with data
  ###
  successtHandler: (translated) ->
    if translated
      chrome.tabs.getSelected(null, (tab) =>
        chrome.tabs.sendMessage(tab.id, {
          action: @messageType translated
          data: translated.outerHTML,
          success: !translated.classList.contains('failTranslate')
        })
      )

  messageType: (translated) ->
    if translated?.rows?.length == 1
      'similar_words'
    else
      'open_tooltip'

  ###
    Parse response from translation engine
  ###
  parse: (response, silent, translate = null) ->
      doc = @stripScripts(response)
      fragment = @makeFragment(doc)
      if fragment
        translate = fragment.querySelector('#translation ~ table')
        if translate
          translate.className = @TABLE_CLASS;
          translate.setAttribute("cellpadding", "5")
          @fixImages(translate)
          @fixLinks(translate)
        else if not silent
          translate = document.createElement('div')
          translate.className = 'failTranslate'
          translate.innerText = "Unfortunately, could not translate"

      return translate;

  ###
    Strip script tags from response html
  ###
  stripScripts: (s) ->
    div = document.createElement('div')
    div.innerHTML = s
    scripts = div.getElementsByTagName('script')
    i = scripts.length
    while i--
      scripts[i].parentNode.removeChild(scripts[i])
    return div.innerHTML;

  makeFragment: (doc, fragment = null) ->
    div = document.createElement("div")
    div.innerHTML = doc
    fragment = document.createDocumentFragment()
    while ( div.firstChild )
      fragment.appendChild( div.firstChild )
    return fragment

  fixImages: (fragment=null) ->
    this.fixUrl(fragment, 'img', 'src');
    return fragment;

  fixLinks: (fragment=null) ->
    this.fixUrl(fragment, 'a', 'href')
    return fragment

  fixUrl: (fragment=null, tag, attr) ->
    if fragment
      tags =  fragment.querySelectorAll(tag)
      parser = document.createElement('a')
      for tag in tags
        parser.href = tag[attr]
        parser.host = @host
        parser.protocol = @protocol
        #fix relative links
        if tag.tagName == 'A'
          tag.classList.add 'mtt_link'
          if parser.pathname.indexOf('m.exe') isnt -1
            parser.pathname = '/c' + parser.pathname
            tag.setAttribute('target', '_blank')
        else if tag.tagName == 'IMG'
          tag.classList.add 'mtt_img'

        tag.setAttribute(attr, parser.href)



module.exports = new Tran