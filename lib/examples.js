function makeUrl(req, path) {
  return 'http://' + req.headers['host'] + path;
}

exports.validAssertion = function validAssertion(req, res, next) {
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
};

exports.validBadge = function validBadge(req, res, next) {
  return res.json(200, {
    name: 'Pizza Badge',
    description: 'For Pizzaing',
    image: makeUrl(req, '/img/badge.png'),
    criteria: makeUrl(req, '/'),
    issuer: makeUrl(req, '/issuer.valid.json'),
    tags: ['pizza', 'slice', 'pie'],
  });
};

exports.validIssuer = function validIssuer(req, res, next) {
  return res.json(200, {
    name: 'OpenBadges Metadata Validator',
    url: makeUrl(req, '/'),
  })
};
