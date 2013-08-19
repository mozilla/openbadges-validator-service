var Future = require('fibers/future');

exports.fiberize = require('./fiber-cucumber.js');
exports.servers = require('./servers');
exports.Phantom = require('./phantom');
exports.FiberWebdriverObject = require('./fiber-webdriver');

exports.waitFor = function waitFor(obj, prop) {
  var f = new Future();
  obj[prop].apply(obj, [].slice.call(arguments, 2).concat([f.resolver()]));
  return f.wait();
};
