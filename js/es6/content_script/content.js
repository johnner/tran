/* global chrome */
/*
 Script embedded on each user page
 Listens messages from translation module and renders popup
 with translated text
*/
require('../polyfills/Array.from.js');

var View = require('./view.js');
var content = new View();