var obvs = require('../');

exports.buildApp = function buildApp(options) {
  options = options || {};
  return obvs.app.build(options);
};
