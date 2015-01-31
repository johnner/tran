"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

/*
  Translation engine: http://www.turkishdictionary.net
  For translating turkish-russian and vice versa
*/
var CHAR_CODES = require("./char-codes.js");

var TurkishDictionary = (function () {
  function TurkishDictionary() {
    this.host = "";
    this.path = "";

    this.msg = "turkishDICT!";
  }

  _prototypeProperties(TurkishDictionary, null, {
    translate: {
      value: function translate() {
        console.log(this.msg);
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return TurkishDictionary;
})();

// Singletone
module.exports = new TurkishDictionary();