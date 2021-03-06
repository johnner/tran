/*
  Multitran depends on html-escaping (not UTF-8) rules for special symbols
  à, è, ì, ò, ù - À, È, Ì, Ò, Ù
  á, é, í, ó, ú, ý - Á, É, Í, Ó, Ú, Ý
  â, ê, î, ô, û Â, Ê, Î, Ô, Û
  ã, ñ, õ Ã, Ñ, Õ
  ä, ë, ï, ö, ü, ÿ Ä, Ë, Ï, Ö, Ü,
  å, Å
  æ, Æ
  ç, Ç
  ð, Ð
  ø, Ø
  ¿ ¡ ß
*/
const CHAR_CODES = {
  //russian
  '%D1%8A': {val:'%FA', lang:'ru'}, // ъ
  '%D0%AA': {val:'%DA', lang:'ru'},// Ъ

  '%C3%80': '&#192;', // À
  '%C3%81': '&#193;', // Á
  '%C3%82': '&#194;', // Â
  '%C3%83': '&#195;', // Ã
  '%C3%84': '&#196;', // Ä
  '%C3%85': '&#197;', // Å
  '%C3%86': '&#198;', // Æ

  '%C3%87': '&#199;', // Ç
  '%C3%88': '&#200;', // È
  '%C3%89': '&#201;', // É
  '%C3%8A': '&#202;', // Ê
  '%C3%8B': '&#203;', // Ë

  '%C3%8C': '&#204;', // Ì
  '%C3%8D': '&#205;', // Í
  '%C3%8E': '&#206;', // Î
  '%C3%8F': '&#207;', // Ï

  '%C3%91': '&#209;', // Ñ
  '%C3%92': '&#210;', // Ò
  '%C3%93': '&#211;', // Ó
  '%C3%94': '&#212;', // Ô
  '%C3%95': '&#213;', // Õ
  '%C3%96': '&#214;', // Ö

  '%C3%99': '&#217;', // Ù
  '%C3%9A': '&#218;', // Ú
  '%C3%9B': '&#219;', // Û
  '%C3%9C': '&#220;', // Ü


  '%C3%A0': '&#224;', // à
  '%C3%A1': '&#225;', // á
  '%C3%A2': '&#226;', // â
  '%C3%A3': '&#227;', // ã
  '%C3%A4': '&#228;', // ä
  '%C3%A5': '&#229;', // å
  '%C3%A6': '&#230;', // æ
  '%C3%A7': '&#231;', // ç


  '%C3%A8': '&#232;', // è
  '%C3%A9': '&#233;', // é
  '%C3%AA': '&#234;', // ê
  '%C3%AB': '&#235;', // ë

  '%C3%AC': '&#236;', // ì
  '%C3%AD': '&#237;', // í
  '%C3%AE': '&#238;', // î
  '%C3%AF': '&#239;', // ï

  '%C3%B0': '&#240;', // ð
  '%C3%B1': '&#241;', // ñ

  '%C3%B2': '&#242;', // ò
  '%C3%B3': '&#243;', // ó
  '%C3%B4': '&#244;', // ô
  '%C3%B5': '&#245;', // õ
  '%C3%B6': '&#246;', // ö

  '%C3%B9': '&#249;', // ù
  '%C3%BA': '&#250;', // ú
  '%C3%BB': '&#251;', // û
  '%C3%BC': '&#252;', // ü
  '%C3%BF': '&#255;', // ÿ
  '%C5%B8': '&#376;', // Ÿ

  '%C3%9F': '&#223;', // ß

  '%C2%BF': '&#191;', // ¿
  '%C2%A1': '&#161;', // ¡
};

export default CHAR_CODES;
