###
  Extension popup window
  Shows search form and dropdown menu with languages
###
SearchForm = require('./search_form.coffee')

document.addEventListener "DOMContentLoaded", ->
  form = new SearchForm document.getElementById('tran-form')
  link = document.getElementById('header-link')
  if link
    link.addEventListener 'click', (e) ->
      e.preventDefault();
      href = e.target.getAttribute('href') + form.getValue()
      chrome.tabs.create({ url: href })
