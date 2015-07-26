"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Utils = (function () {
  function Utils() {}

  _prototypeProperties(Utils, null, {
    request: {
      value: function request(type, url, opts) {
        // Return a new promise.
        return new Promise(function (resolve, reject) {
          // Do the usual XHR stuff
          var req = new XMLHttpRequest();
          req.withCredentials = true;
          req.open(type, url);
          if (type == "POST") {
            req.setRequestHeader("Content-Type", "application/json");
          }
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

          // Set headers
          if (opts.headers) {
            for (var _iterator = Object.keys(opts.headers)[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
              var key = _step.value;
              req.setRequestHeader(key, opts.headers[key]);
            }
          }
          // Make the request
          req.send(JSON.stringify(opts.data));
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    get: {
      value: function get(url) {
        var opts = arguments[1] === undefined ? { data: "" } : arguments[1];
        return this.request("GET", url, opts);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    post: {
      value: function post(url) {
        var opts = arguments[1] === undefined ? { data: "" } : arguments[1];
        return this.request("POST", url, opts);
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Utils;
})();

module.exports = new Utils();