/*
  Extension popup window
  Shows search form and dropdown menu with languages
*/
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import "../../less/popup.less";
import SearchForm from './search_form.js';


// loads the Icon plugin
UIkit.use(Icons);

document.addEventListener('DOMContentLoaded', () => {
  const tranForm = document.querySelector('form');
  const form = new SearchForm(tranForm);
  const link = document.getElementById('header-link');
  if (link) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = e.target.getAttribute('href') + form.getValue();
      chrome.tabs.create({ url: href });
    });
  }
});


