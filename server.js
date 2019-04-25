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
  // Always print the cookies to the terminal
  printCookies(req.headers.cookie);
  // Respond to the request
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
      res.setHeader('Set-Cookie', "count=0");
      fs.readFile('public/index.html', function(err, data){
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      });
      break;

    // Increment the cookie 'count' value
    case '/increment':
      // Cookies are sent back to the server via the cookie header,
      // we can retrieve them from there.  However, to access
      // values we must parse them first.
      var cookies = parseCookie(req.headers.cookie);
      var count = parseInt(cookies["count"]);
      count++;
      // Similarly, we can change thier values with a response header
      res.setHeader('Set-Cookie', "count=" + count);
      fs.readFile('public/index.html', function(err, data) {
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      });
      break;

      // Decrement the cookie 'count' value
      case '/decrement':
        // Decrement works like increment, we parse
        // the cookie, convert the count to an int,
        // and decrement it before setting a new value
        // for it in the Set-Cookie header.
        var cookies = parseCookie(req.headers.cookie);
        var count = parseInt(cookies["count"]);
        count--;
        res.setHeader('Set-Cookie', "count=" + count);
        fs.readFile('public/index.html', function(err, data) {
          res.setHeader("Content-Type", "text/html");
          res.end(data);
        });
        break;

      // Set an HTTPOnly cookie
      case '/secret':
        res.setHeader('Set-Cookie', "message=shhh; HTTPOnly;");
        fs.readFile('public/index.html', function(err, data) {
          res.setHeader("Content-Type", "text/html");
          res.end(data);
        });
        break;
      
      // Set a Secure cookie
      case '/secure':
        res.setHeader('Set-Cookie', "secure-message=foobar; Secure;");
        fs.readFile('public/index.html', function(err, data) {
          res.setHeader("Content-Type", "text/html");
          res.end(data);
        });
        break;
      
      // Set a Max-Age cookie
      case '/timeout':
        res.setHeader('Set-Cookie', "timeout=when?; Max-Age=30");
        fs.readFile('public/index.html', function(err, data) {
          res.setHeader("Content-Type", "text/html");
          res.end(data);
        });
        break;
      
      // Serve a 404 error
      default:
        res.statusCode = 404;
        res.statusMessage = "Not Found";
        break;
  }
}

/** @function parseCookie
 * Parses a cookie and converts it to an associative array
 * @param {string} cookie - the cookie to parse
 * @returns {Object} the assocative array of key/value pairs
 */
function parseCookie(cookie) {
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

/** @function printCookies 
 * Prints the cookies found in the provided cookie string
 * to the terminal. 
 * @param {string} cookie - the unparsed cookie string.
 */
function printCookies(cookie) {
  var cookies = parseCookie(cookie);
  // Print the parsed cookies
  console.log("Cookies:");
  for(var key in cookies) {
    console.log(key, cookies[key]);
  }
  console.log('');
}

// Start the server
server.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
});
