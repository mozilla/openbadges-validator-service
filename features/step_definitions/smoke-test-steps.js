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
  });

  this.When(/^I paste in a properly formatted ([\d\.]+ \w+)$/, function(type) {
    this.browser.get(this.url('/'));
    this.browser.elementByCss('textarea[name="assertion"]').type(ASSERTIONS[type]);
    this.browser.elementByCss('#js-assertion-form').submit();
    this.browser.waitForElementByCssSelector('#js-result-container .status', 15000);
  });

  this.Then(/^I expect the validator to report that it's valid$/, function(callback) {
    assert.equal(this.browser.elementByCss('.status').text(), 'Valid',
                 "result status should show 'Valid'");
  });

  this.Then(/^show me that it's version ([\d\.]+)$/, function(version) {
    assert(this.browser.elementByCss('.version').text().indexOf(version) !== -1,
           "correct version displayed");
  });

});