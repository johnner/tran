"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = (function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, [{
    key: "request",
    value: function request(type, url, opts) {
      // Return a new promise.
      return new Promise(function (resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.withCredentials = true;
        req.open(type, url);
        if (type == 'POST') {
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
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Object.keys(opts.headers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var key = _step.value;

              req.setRequestHeader(key, opts.headers[key]);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
        // Make the request
        req.send(JSON.stringify(opts.data));
      });
    }
  }, {
    key: "get",
    value: function get(url) {
      var opts = arguments.length <= 1 || arguments[1] === undefined ? { data: '' } : arguments[1];

      return this.request('GET', url, opts);
    }
  }, {
    key: "post",
    value: function post(url) {
      var opts = arguments.length <= 1 || arguments[1] === undefined ? { data: '' } : arguments[1];

      return this.request('POST', url, opts);
    }
  }]);

  return Utils;
})();

module.exports = new Utils();
//# sourceMappingURL=utils.js.map
