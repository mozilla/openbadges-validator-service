var http = require('http');
var url = require('url');
var assert = require('assert');
var colors = require('colors');
var wd = require('wd');

var service = require('../../');
var support = require('../../test/acceptance');
var waitFor = support.waitFor;

var initialized = false;

var CUCUMBER_DEBUG = 'ACCEPTANCE_DEBUG' in process.env;
var CUCUMBER_BROWSER_NAME = process.env.ACCEPTANCE_BROWSER_NAME || 'phantom';
var CUCUMBER_EXTERNAL_URL = process.env.ACCEPTANCE_EXTERNAL_URL;

process.on('uncaughtException', function(err) {
  console.error(err.stack);
  support.Phantom.stopAll();
  support.servers.stopAll(function() {
    process.exit(1);
  });
});

process.on('exit', function() {
  support.Phantom.stopAll();
  support.servers.stopAll(function() {});
});

function showWebdriverDebugOutput(asyncBrowser) {
  asyncBrowser.on('status', function(info) {
    console.info(info.cyan);
  });

  asyncBrowser.on('command', function(meth, path, data) {
    console.info(' > ' + meth.yellow, path.grey, data || '');
  });  
}

module.exports = support.fiberize(function() {
  this.Before(function() {
    var setupStartTime = Date.now();
    var phantom;
    var asyncBrowser;
    var app = service.app.build({
      logLevel: 'fatal'       
    });
    var server = http.createServer(app);

    if (CUCUMBER_BROWSER_NAME == 'phantom') {
      phantom = support.Phantom();
      asyncBrowser = phantom.createWebdriver();
    } else {
      asyncBrowser = wd.remote();
    }

    if (CUCUMBER_DEBUG) {
      showWebdriverDebugOutput(asyncBrowser);
    } else {
      console.info = function() {};
    }

    if (!initialized) {
      if (phantom) waitFor(support.servers, 'start', phantom);
      initialized = true;
    }
    waitFor(asyncBrowser, 'init', {
      browserName: CUCUMBER_BROWSER_NAME
    });
    this.browser = new support.FiberWebdriverObject(asyncBrowser);
    this.phantom = phantom;
    waitFor(server, 'listen');
    this.app = app;
    this.server = server;
    this.url = function(path) {
      var base = CUCUMBER_EXTERNAL_URL || 'http://localhost:' + server.address().port;
      return url.resolve(base, path);
    };
    this.answerNextPromptWith = function(response) {
      // We need to do this because phantomjs doesn't support
      // window.prompt().
      this.browser.eval("window.prompt = function() { return " +
                        JSON.stringify(response) + "; };");
    };
    this.waitFor = waitFor;
    this._scenarioStartTime = Date.now();
    console.info("Scenario setup completed in " +
                 (this._scenarioStartTime - setupStartTime) + " ms.");
  });

  this.After(function() {
    console.info("Scenario steps completed in " +
                 (Date.now() - this._scenarioStartTime) + " ms.");
    this.browser.quit();
    this.server.close();
  });
});
