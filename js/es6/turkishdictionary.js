/*
  Translation engine: http://www.turkishdictionary.net
  For translating turkish-russian and vice versa
*/
var CHAR_CODES = require('./char-codes.js');

class TurkishDictionary {
  constructor() {
  	this.host = '';
  	this.path = '';

  	this.msg =  'turkishDICT!';
  }

  translate() {
  	console.log(this.msg);
  }
}

// Singletone
module.exports = new TurkishDictionary();