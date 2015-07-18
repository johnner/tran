"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Utils = (function () {
  function Utils() {}

  _prototypeProperties(Utils, null, {
    get: {
      value: function get(url) {
        // Return a new promise.
        return new Promise(function (resolve, reject) {
          // Do the usual XHR stuff
          var req = new XMLHttpRequest();
          req.open("GET", url);

          req.onload = function () {
            // This is called even on 404 etc
            // so check the status
            if (req.status == 200) {
              // Resolve the promise with the response text
              resolve(req.response);
            } else {
              // Otherwise reject with the status text
              // which will hopefully be a meaningful error
              reject(Error(req.statusText));
            }
          };

          // Handle network errors
          req.onerror = function () {
            reject(Error("Network Error"));
          };

          // Make the request
          req.send();
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Utils;
})();

module.exports = new Utils();