// This module makes it easier to write cucumber-js step definitions in
// a synchronous style by running each step in a Fiber.
//
// Here's a simple asynchronous step definition module:
//
//   module.exports = function() {
//     this.When(/^a user taps the link "([^"]*)"$/, function(label, cb) {
//       cb.pending();
//     });
//   };
//
// Here's the synchronous version:
//
//   module.exports = fiberize(function() {
//     this.When(/^a user taps the link "([^"]*)"$/, function(label) {
//       this.pending();
//     });
//   });
//
// When control reaches the end of the step definition without
// an exception being thrown or this.pending() being called, the step
// is successful.

var Fiber = require('fibers');

function fiberizeDefine(func) {
  return function() {
    var args = [].slice.call(arguments);
    var callback = args[args.length - 1];
    var world = this;
    var pendingCalled = false;

    if (callback.pending)
      world.pending = function() {
        pendingCalled = true;
        callback.pending();
      };

    Fiber(function() {
      try {
        func.apply(world, args.slice(0, -1));
      } catch (e) {
        if (callback.fail && !pendingCalled)
          return callback.fail(e);
        throw e;
      }
      if (!pendingCalled)
        callback();
    }).run();
  }
}

module.exports = function fiberize(func) {
  return function() {
    var asyncCucumberApi = this;
    var api = {
      Before: function fiberDefineBeforeHook(fn) {
        asyncCucumberApi.Before(fiberizeDefine(fn));
      },
      After: function fiberDefineAfterHook(fn) {
        asyncCucumberApi.After(fiberizeDefine(fn));
      },
      defineStep: function fiberDefineStep(regexp, fn) {
        asyncCucumberApi.defineStep(regexp, fiberizeDefine(fn));
      },
      World: asyncCucumberApi.World
    };
    api.Given = api.When = api.Then = api.defineStep;

    return func.call(api);
  }
};
