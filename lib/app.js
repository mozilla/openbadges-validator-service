const express = require('express');

const paths = require('./paths');
const website = require('./website');
const examples = require('./examples');

exports.build = function(options) {

  const app = express();

  app.use(express.logger());
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.static(paths.staticDir));

  app.post('/', website.validate);

  app.get('/assertion.valid.json', examples.validAssertion);
  app.get('/badge.valid.json', examples.validBadge);
  app.get('/issuer.valid.json', examples.validIssuer);

  return app;
};

