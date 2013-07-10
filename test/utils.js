var obvs = require('../');

exports.buildApp = function buildApp(options) {
  options = options || { logLevel: 'fatal' };
  return obvs.app.build(options);
};
