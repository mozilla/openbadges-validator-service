function makeUrl(host, path) {
  return 'http://' + host + path;
}

exports.host = function host(generator) {
  return function(req, res, next) {
    var json = generator(req.headers['host']);
    return res.json(200, json); 
  };
};

exports.validAssertion = function validAssertion(host) {
  return {
    uid: 'hihihi',
    issuedOn: Date.now()/1000|0,
    badge: makeUrl(host, '/badge.valid.json'),
    recipient: {
      identity: 'brian@example.org',
      type: 'email',
      hashed: 'false'
    },
    verify: {
      type: 'hosted',
      url: makeUrl(host, '/assertion.valid.json')
    },
  };
};

exports.validBadge = function validBadge(host) {
  return {
    name: 'Pizza Badge',
    description: 'For Pizzaing',
    image: makeUrl(host, '/img/badge.png'),
    criteria: makeUrl(host, '/'),
    issuer: makeUrl(host, '/issuer.valid.json'),
    tags: ['pizza', 'slice', 'pie'],
  };
};

exports.validIssuer = function validIssuer(host) {
  return {
    name: 'OpenBadges Metadata Validator',
    url: makeUrl(host, '/'),
  };
};
