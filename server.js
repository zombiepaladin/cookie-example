/** server.js
 * Server for an example of sessions
 */

// Constants
const PORT = 3000;

// Requires
var fs = require('fs');
var http = require('http');
var server = new http.Server(handleRequest);

/** @function handleRequest
 * The webserver's request handling function
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 */
function handleRequest(req, res) {
  switch(req.url) {
    // Serve the index file
    case '/':
    case '/index.html':
      fs.readFile('public/index.html', function(err, data){
        if(err){
        }
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      });
      break;
    // Serve the css file
    case '/app.css':
      fs.readFile('public/app.css', function(err, data){
        if(err){
        }
        res.setHeader("Content-Type", "text/css");
        res.end(data);
      });
      break;
    // Serve the js file
    case '/app.js':
      fs.readFile('public/app.js', function(err, data){
        if(err){
        }
        res.setHeader("Content-Type", "text/js");
        res.end(data);
      });
      break;

    // Reset the cookie 'count' value
    case '/reset':
      // The Set-Cookie header sends cookie values to the client to save
      res.setHeader('Set-Cookie', ["count=0"]);
      fs.readFile('public/index.html', function(err, data){
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      });
      break;

    case '/increment':
      // Cookies are sent back to the server via the cookie header,
      // we can retrieve them from there.  However, to access
      // values we must parse them first.
      var cookies = parseCookie(req.headers.cookie);
      var count = parseInt(cookies["count"]);
      count++;
      // Similarly, we can change thier values with a response header
      res.setHeader('Set-Cookie', ["count=" + count]);
      fs.readFile('public/index.html', function(err, data) {
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      });
      break;

      case '/decrement':
        // Decrement works like increment, we parse
        // the cookie, convert the count to an int,
        // and decrement it before setting a new value
        // for it in the Set-Cookie header.
        var cookies = parseCookie(req.headers.cookie);
        var count = parseInt(cookies["count"]);
        count--;
        res.setHeader('Set-Cookie', ["count=" + count]);
        fs.readFile('public/index.html', function(err, data) {
          res.setHeader("Content-Type", "text/html");
          res.end(data);
        });
        break;

      case '/secret':
        res.setHeader('Set-Cookie', ["message=shhh; HTTPOnly;"]);
        fs.readFile('public/index.html', function(err, data) {
          res.setHeader("Content-Type", "text/html");
          res.end(data);
        });
        break;
  }
}

/** @function parseCookie
 * Parses a cookie and converts it to an associative array
 * @param {string} cookie - the cookie to parse
 * @returns {Object} the assocative array of key/value pairs
 */
function parseCookie(cookie) {
  console.log(cookie);
  var cookies = {};
  // Cookies are key/value pairs separated by semicolons,
  // followed by a space, so split the cookie by that string
  cookie.split('; ').forEach(function(pair) {
    // Individual key/value are separated by an equal sign (=)
    pair = pair.split('=');
    var key = pair[0];
    // values are URI encoded, so decode them
    var value = decodeURIComponent(pair[1]);
    // Assign values to keys in the associative array
    cookies[key] = value;
  });
  // Return the parsed cookies
  return cookies;
}

// Start the server
server.listen(PORT, function(){
  console.log(PORT);
});
