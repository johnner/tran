class Meaning {
  constructor(opts) {
    this.text = opts.text;
    this.url = opts.url;
    this.comment = opts.comment;
    this.authors = [];
  }
}

class Subject {
  constructor(opts) {
    this.name = opts.name;
    this.fullName = opts.fullName;
    this.url = opts.url;
    this.meanings = [];
  }

  addMeaning(meaning) {
    this.meanings.push(meaning);
  }

  hasMeaning(meaning) {
    for (let i = 0; i < this.meanings.length; i++) {
      if (this.meanings[i].text.trim() === meaning) {
        return true;
      }
    }
  }
}

class Header {
  constructor(opts) {
    this.word = opts.word;
    this.url = opts.url;
    this.transcription = opts.transcription;
    this.speechPart = opts.speechPart;
    this.phrasesLink = opts.phrasesLink;
    this.subjects = [];
  }

  addSubject(subject) {
    this.subjects.push(subject);
  }
}

const MtURL = 'https://www.multitran.com/';

class TranslationParser {
  constructor(opts) {
    this.sourceHtml = JSON.parse(JSON.stringify(opts.sourceHtml));
    const doc = this._stripScripts();
    this.fragment = this._makeFragment(doc);
    this.headers = [];
    this._parse();
    this._deduplicate();
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
    const div = document.createElement('div');
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
    const rows = this.fragment.querySelectorAll('#translation ~ table tr');
    const headerRowIndexes = [];
    let header;
    // extract headers
    for (let i = 0; i < rows.length; i++) {
      const row = rows.item(i);
      header = this._extractHeader(row);
      if (header) {
        headerRowIndexes.push(i);
        this.headers.push(header);
      }
    }

    let hIdx = 0;
    let lastIdx = headerRowIndexes.length - 1;

    // extract subjects and meanings
    for (let i = 0; i < rows.length; i++) {
      if (
        (i > headerRowIndexes[hIdx] && i < headerRowIndexes[hIdx + 1]) ||
        (i > headerRowIndexes[lastIdx])
      ) {
        const subject = this._extractSubject(rows[i]);
        if (subject) {
          if (this.headers[hIdx]) {
            this.headers[hIdx].addSubject(subject);
            this._addMeanings(rows[i], subject);
          }
        }
      } else if (i === headerRowIndexes[hIdx + 1]) {
        hIdx++;
      }
    }
  }

  _addMeanings(row, subject) {
    const values = this._extractValues(row);
    for (const value of values) {
      const meaning = this._extractMeaning(value);
      if (meaning) {
        subject.addMeaning(meaning);
      }
    }
  }

  _extractHeader(row) {
    const td = row.querySelector('td');
    if (this._hasWord(td)) {
      return new Header({
        word: td.querySelector('a:first-child').innerHTML.replace('!', ''),
        url: `${MtURL}${td.querySelector('a:first-child').getAttribute('href')}`,
        transcription: this._getTranscription(td).trim(),
        speechPart: td.querySelector('em') ? td.querySelector('em').innerText.trim() : ''
        // TODO: add phrases
        // phrasesLink:
      });
    }
  }

  _getTranscription(td) {
    const el = td.querySelector('span');
    let transcription = '';
    if (el && el.innerHTML.indexOf('[') > -1 && el.innerHTML.indexOf(']') > -1) {
      transcription = el.innerHTML;
    }
    return transcription;
  }

  _hasWord(td) {
    return td && td.classList.contains('gray') && td.querySelector('a:first-child');
  }

  _extractSubject(row) {
    const subjectEl = row.querySelector('td.subj');
    if (subjectEl) {
      const a = subjectEl.querySelector('a');
      return new Subject({
        name: a.innerText.trim(),
        fullName: a.getAttribute('title'),
        url: `${MtURL}${a.getAttribute('href')}`
      });
    }
  }

  _extractValues(row) {
    const valuesEl = row.querySelector('.trans');
    let values = [];
    if (valuesEl) {
      values = this.convertHTMLEntity(valuesEl.innerHTML).split('; ');
    }
    return values;
  }

  _extractMeaning(value) {
    const fragment = this._makeFragment(value);
    const authors = []
    fragment.querySelectorAll('i > a').forEach(a => {
      authors.push({
        name: a.innerText.trim(),
        url: `${MtURL}${a.getAttribute('href')}`
      });
    })
    if (fragment.querySelector('a')) {
      return new Meaning({
        text: fragment.querySelector('a').innerText.trim(),
        url: `${MtURL}${fragment.querySelector('a').getAttribute('href')}`,
        comment: fragment.querySelector('span'),
        authors: authors
      });
    }
  }

  _deduplicate() {
    let len = this.headers.length;
    while (len--) {
      for (let i = 0; i < len; i++) {
        if (
          this._checkSameWords(this.headers[i].word, this.headers[len].word) &&
          this._checkSpeechParts(this.headers[i].speechPart, this.headers[len].speechPart)
        ) {
          this._concatSubjects(this.headers[i], this.headers[len]);
          this.headers.splice(len, 1);
          break;
        }
      }
    }
  }

  _checkSameWords(word1, word2) {
    const w1 = word1.toLowerCase();
    const w2 = word2.toLowerCase();
    return w1.replace('!', '') === w2.replace('!', '') ||
      w1.replace('-', '') === w2.replace(' ', '') ||
      w1.replace(' ', '') === w2.replace('-', '') ||
      w1.replace('...', '') === w2.replace('...', '')
  }

  _checkSpeechParts(part1, part2) {
    return (part1 === part2) || !part2;
  }

  _concatSubjects(header1, header2) {
    header1.subjects = header1.subjects.concat(header2.subjects);
    for (let i = 0; i < header1.subjects.length; i++) {
      for (let j = i + 1; j < header1.subjects.length; j++) {
        if (header1.subjects[i].name === header1.subjects[j].name) {
          header1.subjects[j].meanings.forEach(meaning => {
            if (!header1.subjects[i].hasMeaning(meaning.text)) {
              header1.subjects[i].addMeaning(meaning);
            }
          });
          header1.subjects.splice(j, 1);
        }
      }
    }
  }
}

export default TranslationParser;