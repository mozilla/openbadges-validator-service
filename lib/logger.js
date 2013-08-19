const bunyan = require('bunyan');
const util = require('util');

function validationSerializer(info) {
  if ('resources' in info)
    delete info.resources;
  return info;
}

const log = module.exports = bunyan.createLogger({
  name: 'openbadges-validator-service',
  stream: process.stdout,
  level: 'info',
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
    validation: validationSerializer
  }
});

log.middleware = function middleware() {
  return function (req, res, next) {
    const startTime = new Date();
    log.info({
      req: req
    }, util.format(
      'Incoming Request: %s %s',
      req.method, req.url));

    // this method of hijacking res.end is inspired by connect.logger()
    // see connect/lib/middleware/logger.js for details
    const end = res.end;
    res.end = function(chunk, encoding) {
      const responseTime = new Date() - startTime;
      res.end = end;
      res.end(chunk, encoding);
      log.info({
        url: req.url,
        responseTime: responseTime,
        res: res,
      }, util.format(
        'Outgoing Response: HTTP %s %s (%s ms)',
        res.statusCode, req.url, responseTime));
    };
    return next();
  };
};

log.init = function init() {
  // Ensure uncaught exceptions end up in the event stream too
  process.once('uncaughtException', function (err) {
    log.fatal(err);
    throw err;
  });

  // Patch console so it only outputs to stderr
  console.log = function() {
    process.stderr.write(util.format.apply(this, arguments) + '\n');
  };
  console.dir = function(object) {
    process.stderr.write(util.inspect(object) + '\n');
  };
};
