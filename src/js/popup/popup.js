/*
  Extension popup window
  Shows search form and dropdown menu with languages
*/
import "../../less/popup.less";
import '../../less/bootstrap.less';
import SearchForm from './search_form.js';

document.addEventListener('DOMContentLoaded', () => {
  const tranForm = document.getElementById('tran-form');
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


