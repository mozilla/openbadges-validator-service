const express = require('express');

const paths = require('./paths');
const website = require('./website');
const examples = require('./examples');
const logger = require('./logger');

exports.build = function(options) {
  options = options || {};

  const app = express();

  if (options.logLevel) 
    logger.level(options.logLevel);

  app.use(logger.middleware());
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.static(paths.staticDir));

  app.post('/', website.validate);

  var host = examples.host;
  app.get('/assertion.valid.json', host(examples.validAssertion));
  app.get('/badge.valid.json', host(examples.validBadge));
  app.get('/issuer.valid.json', host(examples.validIssuer));

  return app;
};

