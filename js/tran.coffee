###global chrome###
###
 Translation-module that makes requests to language-engine,
 parses results and sends plugin-global message with translation data
###
window.tran =
  TABLE_CLASS: "___mtt_translate_table",
  protocol: 'http',
  host: 'www.multitran.ru',
  path: '/c/m.exe',
  query: '&s=',
  lang: '?l1=2&l2=1', #from russian to english by default
  xhr: {},

  ###
    Context menu click handler
  ###
  click: (data) ->
    if typeof data.silent == undefined || data.silent == null
      data.silent = true # true by default
    tran.search
        value: data.selectionText
        success: tran.successtHandler
        silent: data.silent  # if translation failed do not show dialog

  ###
    Initiate translation search
  ###
  search: (params) ->
    #value, callback, err
    chrome.storage.sync.get({language: '1'}, (items) ->
      if language is ''
        language = '1'
      tran.setLanguage(items.language)
      url = tran.makeUrl(params.value);
      # decorate success to make preliminary parsing
      origSuccess = params.success
      params.success = (response) ->
        translated = tran.parse(response, params.silent)
        origSuccess(translated)

      # make request
      tran.request(
        url: url,
        success: params.success,
        error: params.error
      )
    )

  setLanguage: (language) ->
    tran.lang = '?l1=2&l2=' + language

  ###
    Request translation and run callback function
    passing translated result or error to callback
  ###
  request: (opts) ->
    xhr = tran.xhr = new XMLHttpRequest()
    xhr.onreadystatechange = (e) ->
      xhr = tran.xhr
      if xhr.readyState < 4
        return
      else if xhr.status != 200
        tran.errorHandler(xhr)
        if (typeof opts.error == 'function')
          opts.error()
        return
      else if xhr.readyState == 4
          return opts.success(e.target.response)

    xhr.open("GET", opts.url, true);
    xhr.send();


  makeUrl: (value) ->
    url = [tran.protocol, '://',
              tran.host,
              tran.path,
              tran.lang,
              tran.query,
              encodeURI(value) ].join('')
    return url;

  errorHandler: (xhr) ->
    console.log('error', xhr)

  ###
   Recieving data from translataion-engine and send ready message with data
  ###
  successtHandler: (translated) ->
      chrome.tabs.getSelected(null, (tab) ->
        chrome.tabs.sendMessage(tab.id, {
          action:  "open_tooltip",
          data: translated.outerHTML,
          success: !translated.classList.contains('failTranslate')
        })
      )

  ###
    Parse response from translation engine
  ###
  parse: (response, silent, translate = null) ->
      doc = tran.stripScripts(response)
      fragment = tran.makeFragment(doc)
      if fragment
        translate = fragment.querySelector('#translation ~ table')
        if translate
          translate.className = tran.TABLE_CLASS;
          translate.setAttribute("cellpadding", "5")
          tran.fixImages(translate)
          tran.fixLinks(translate)
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
        parser.host = tran.host
        parser.protocol = tran.protocol
        #fix relative links
        if tag.tagName == 'A'
          tag.classList.add 'mtt_link'
          if parser.pathname.indexOf('m.exe') isnt -1
            parser.pathname = '/c' + parser.pathname
            tag.setAttribute('target', '_blank')
        else if tag.tagName == 'IMG'
          tag.classList.add 'mtt_img'

        tag.setAttribute(attr, parser.href)