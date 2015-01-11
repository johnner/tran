###global tran, chrome###

#load engines
tran = require('./tran.coffee')                     # multitran.ru
turkishDictionary = require('./turkishdictionary.coffee')  # turkishdictionary.net

#generates a context menu
chrome.contextMenus.create(
  title:  'Multitran: "%s"'
  contexts: ["page", "frame", "editable", "image", "video", "audio", "link", "selection"]
  onclick:  (data) ->
    data.silent = false
    tran.click(data)
)

###
 Can't get chrome.storage directly from content_script
 so content_script sends request message and then background script
 responds with storage value
###
chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  if request.method == "get_fast_option"
    chrome.storage.sync.get(fast: true, (items) ->
        sendResponse(fast: items.fast)
        #return true
    )
  #Fast translation initiate search with 'request_search' message from
  #content_script
  else if request.method == 'request_search'
    request.data.silent = true
    tran.click(request.data)
  true

