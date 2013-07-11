var obvs = require('../');

exports.buildApp = function buildApp(options) {
  options = options || { logLevel: 'fatal' };
  var app =  obvs.app.build(options);
  return app;
};
