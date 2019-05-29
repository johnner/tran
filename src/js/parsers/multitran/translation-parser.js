class Meaning {
  constructor(opts) {
    this.text = opts.text;
    this.url = opts.url;
    this.comment = opts.comment;
    this.authors = [];
  }
}

class Translation {
  constructor(opts) {
    this.subject = opts.subject;
    this.meanings = [];
  }

  addMeaning(meaning) {
    this.meanings.push(meaning);
  }
}

class Header {
  constructor(opts) {
    this.word = opts.word;
    this.url = opts.url;
    this.transcription = opts.transcription;
    this.speechPart = opts.speechPart;
    this.phrasesLink = opts.phrasesLink;
    this.translations = [];
  }

  addTranslation(translation) {
    this.translations.push(translation);
  }
}

const MtURL = 'https://www.multitran.com/';

class TranslationParser {
  constructor(opts) {
    this.sourceHtml = JSON.parse(JSON.stringify(opts.sourceHtml));
    const doc = this._stripScripts();
    const fragment = this._makeFragment(doc);
    this.sourceHtmlEl = fragment.querySelector('#translation ~ table');

    this.headers = [];
    this._parse();
  }

  //  Strip script tags from response html
  _stripScripts() {
    let div = document.createElement('div');
    div.innerHTML = this.sourceHtml;
    let scripts = div.getElementsByTagName('script');
    let i = scripts.length;
    while (i--) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }
    return div.innerHTML;
  }

  _makeFragment(doc) {
    const fragment = document.createDocumentFragment();
    const div = document.createElement("div");
    div.innerHTML = doc;
    while (div.firstChild) {
      fragment.appendChild(div.firstChild);
    }
    return fragment;
  }

  convertHTMLEntity(text) {
    const span = document.createElement('span');

    return text
      .replace(/&[#A-Za-z0-9]+;/gi, (entity) => {
        span.innerHTML = entity;
        return span.innerText;
      });
  }

  _parse() {
    const rows = this.sourceHtmlEl.querySelectorAll('tr');
    let header;

    for (const row of rows) {
      const td = row.querySelector('td');

      if (td.classList.contains('gray')) {
        if (td.querySelector('a:first-child')) {
          header = new Header({
            word: td.querySelector('a:first-child').innerHTML,
            url: `${MtURL}${td.querySelector('a:first-child').getAttribute('href')}`,
            transcription: td.querySelector('span') ? td.querySelector('span').innerHTML : '',
            speechPart: td.querySelector('em') ? td.querySelector('em').innerHTML : ''
            // TODO: add phrases
            // phrasesLink:
          });
          this.headers.push(header);
        }
      }

      if (header) {
        let translation = undefined;
        const tds = row.querySelectorAll('td');
        const subjTd = tds[0];
        const transTd = tds[1];
        if (subjTd && transTd) {
          if (subjTd.classList.contains('subj')) {
            translation = new Translation({
              subject: subjTd.querySelector('a').innerHTML
            });
            header.addTranslation(translation);
          }
          if (transTd.classList.contains('trans')) {
            const trans = this.convertHTMLEntity(transTd.innerHTML).split('; ');
            for (const tran of trans) {
              const fragment = this._makeFragment(tran);
              const authors = []
              fragment.querySelectorAll('i > a').forEach(a => {
                authors.push({
                  name: a.innerText,
                  url: `${MtURL}${a.getAttribute('href')}`
                });
              })
              if (fragment.querySelector('a')) {
                const meaning = new Meaning({
                  text: fragment.querySelector('a').innerText,
                  url: `${MtURL}${fragment.querySelector('a').getAttribute('href')}`,
                  comment: fragment.querySelector('span'),
                  authors: authors
                });
                translation.addMeaning(meaning);
              }
            }
          }
        }
      }
    }
  }
}

export default TranslationParser;