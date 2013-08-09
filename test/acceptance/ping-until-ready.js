var async = require('async');
var http = require('http');
var urlParse = require('url').parse;

var PING_INTERVAL = 100;
var TIMEOUT = 10000;

function ping(url, cb) {
  var urlInfo = urlParse(url);
  var ended = false;
  var end = function(success) {
    if (ended) return;
    ended = true;
    clearTimeout(timeout);
    cb(null, success);
  };
  var timeout = setTimeout(end.bind(null, false), TIMEOUT);
  var req = http.request({
    hostname: urlInfo.hostname,
    port: urlInfo.port,
    path: urlInfo.pathname
  }, function(res) {
    end(res.statusCode == 200);
  });

  req.on('error', end.bind(null, false));
  req.end();
};

module.exports = function pingUntilReady(url, timeout, cb) {
  var startTime = Date.now();
  var timeElapsed;
  var pingSuccess = false;

  async.whilst(function test() {
    timeElapsed = Date.now() - startTime;
    return timeElapsed < timeout && !pingSuccess;
  }, function keepTrying(cb) {
    ping(url, function(err, success) {
      if (err) return cb(err);
      pingSuccess = success;
      cb();
    });
  }, function(err) {
    if (err) return cb(err);
    if (timeElapsed >= timeout)
      return cb(new Error("timeout (" + timeout +
                          "ms) exceeded when pinging " + url));
    cb();
  });
};

if (!module.parent) {
  if (process.argv.length < 3) {
    console.log("usage: ping-until-ready.js <url>");
    process.exit(1);
  }
  console.log("Attempting to ping " + process.argv[2]);
  module.exports(process.argv[2], 5000, function(err) {
    if (err) throw err;
    console.log("Success!");
  });
}
