var assert = require('assert');

var fiberize = require('../../test/acceptance').fiberize;
var examples = require('../../lib/examples');

var ASSERTIONS = {};

module.exports = fiberize(function() {

  this.Before(function() {
    var host = this.url('');
    ASSERTIONS['0.5.0 assertion'] = JSON.stringify(examples.validOldAssertion(host));
    ASSERTIONS['1.0.0 assertion'] = JSON.stringify(examples.validAssertion(host));
    ASSERTIONS['1.0.0 signature'] = JSON.stringify(examples.validSignature(host));
    ASSERTIONS['bad assertion'] = '{ "not": "an assertion at all" }';
    ASSERTIONS['bad signature'] = 'randomstring';
  });

  this.When(/^I paste in a (.*)$/i, function(type) {
    this.browser.get(this.url('/'));
    this.browser.elementByCss('textarea[name="assertion"]').type(ASSERTIONS[type]);
    this.browser.elementByCss('#js-assertion-form').submit();
    this.browser.waitForElementByCssSelector('#js-result-container .status', 15000);
  });

  this.Then(/^I expect the validator to report that it's (valid|invalid)$/i, function(validity, callback) {
    validity = validity.toLowerCase();
    assert.equal(this.browser.elementByCss('.status').text().toLowerCase(), validity,
                 "result status should show '" + validity + "'");
  });

  this.Then(/^show me that it's version ([\d\.]+)$/i, function(version) {
    assert(this.browser.elementByCss('.version').text().indexOf(version) !== -1,
           "correct version displayed");
  });

  this.Then(/^show \w+ reason(?: "([^"]*)")?$/i, function(reason, callback) {
    assert(this.browser.hasElementByCssSelector('.reason'), "reason element exists");
    if (reason)
      assert(this.browser.elementByCss('.reason').text().match(new RegExp(reason, 'i')),
             "matches provided reason");
  });

});