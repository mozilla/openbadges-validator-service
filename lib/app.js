const express = require('express');
const dataurl = require('dataurl');
const validator = require('openbadges-validator');

const paths = require('./paths');

exports.build = function(options) {

  const app = express();

  app.use(express.logger());
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.static(paths.staticDir));

  app.post('/', function (req, res, next) {
    var assertion;
    const assertionString = req.body.assertion || null;
    if (!assertionString)
      return res.json(200, {
        status: 'invalid',
        reason: 'missing assertion',
        error: {}
      });

    try {
      assertion = JSON.parse(assertionString);
    } catch(e) {
      return res.json(200, {
        status: 'invalid',
        reason: 'Could not parse string as JSON',
        error: e
      });
    }

    validator(assertion, function (err, info) {
      // We might want to display the images that we found. The easiest
      // way to do that is to convert them to dataurls so we can just
      // stick 'em into <img> tags instead of trying to cache them and
      // re-serve them.
      // if (info && 'resources' in info) {
      //   ;['assertion.image',
      //     'issuer.image',
      //     'badge.image'
      //    ].forEach(function (field) {
      //      if (!(field in info.resources)) return;
      //      info.resources[field] = dataurl.convert({
      //        data: info.resources[field],
      //        mimetype: 'image/png'
      //      });
      //    });
      // }

      if (info && 'resources' in info)
        delete info.resources;

      if (err)
        return res.json(200, {
          status: 'invalid',
          reason: err.message,
          error: err,
          info: info
        });

      return res.json(200, {
        status: 'valid',
        info: info
      });
    });
  });

  function makeUrl(req, path) {
    return 'http://' + req.headers['host'] + path;
  }

  app.get('/assertion.valid.json', function (req, res, next) {
    return res.json(200, {
      uid: 'hihihi',
      issuedOn: Date.now()/1000|0,
      badge: makeUrl(req, '/badge.valid.json'),
      recipient: {
        identity: 'brian@example.org',
        type: 'email',
        hashed: 'false'
      },
      verify: {
        type: 'hosted',
        url: makeUrl(req, '/assertion.valid.json')
      },
    });
  });

  app.get('/badge.valid.json', function (req, res, next) {
    return res.json(200, {
      name: 'Pizza Badge',
      description: 'For Pizzaing',
      image: makeUrl(req, '/img/badge.png'),
      criteria: makeUrl(req, '/'),
      issuer: makeUrl(req, '/issuer.valid.json'),
      tags: ['pizza', 'slice', 'pie'],
    });
  });

  app.get('/issuer.valid.json', function (req, res, next) {
    return res.json(200, {
      name: 'OpenBadges Metadata Validator',
      url: makeUrl(req, '/'),
    })
  });

  return app;
};

