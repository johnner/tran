# Saves options to chrome.storage
save_options = ->
  language = document.getElementById('language').value
  fast = document.getElementById('fast').checked
  chrome.storage.sync.set {language: language, fast: fast}, ->
    # Update status to let user know options were saved.
    status = document.getElementById('status')
    status.textContent = 'Options saved.'

    hideStatus = -> status.textContent = ''
    setTimeout hideStatus, 750

# Restores select box and checkbox state using the preferences
# stored in chrome.storage.
restore_options = ->
  # Use default value language is 'english' and fast translate is true
  chrome.storage.sync.get({ language: '1', fast: true}, (items) ->
    document.getElementById('language').value = items.language
    document.getElementById('fast').checked = items.fast
    save_options()
    return true
  )

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);