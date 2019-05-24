class Utils {
  constructor () {}
  request (type, url, opts) {
    // Return a new promise.
    return new Promise(function(resolve, reject) {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      req.withCredentials = true;
      req.open(type, url);
      if (type == 'POST') {
        req.setRequestHeader("Content-Type", "application/json");
      }
      req.onload = function() {
        // This is called even on 404 etc
        // so check the status
        if (req.status == 200) {
          // Resolve the promise with the response text
          resolve(req.response);
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
        }
      };

      // Handle network errors
      req.onerror = function() {
        reject(Error("Network Error"));
      };

      // Set headers
      if (opts.headers) {
        for (let key of Object.keys(opts.headers)) {
          req.setRequestHeader(key, opts.headers[key]);
        }
      }
      // Make the request
      req.send(JSON.stringify(opts.data));
    });
  }
  get(url, opts={data:''}) {
    return this.request('GET', url, opts);
  }

  post(url, opts={data:''}) {
    return this.request('POST', url, opts);
  }
}
export default new Utils();
