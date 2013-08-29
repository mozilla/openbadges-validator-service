var jws = require('jws');
var keys = require('./keys');

function makeUrl(host, path) {
  if (host.indexOf('http') !== 0)
    host = 'http://' + host;
  host += path;
  return host.replace(/([^:\/])\/\//g, '$1/');
}

exports.host = function host(generator) {
  return function(req, res, next) {
    return res.send(200, generator(req.headers['host'])); 
  };
};

exports.validAssertion = function validAssertion(host) {
  return {
    uid: 'hihihi',
    issuedOn: 1375296876, //Date.now()/1000|0,
    badge: makeUrl(host, '/badge.valid.json'),
    recipient: {
      identity: 'brian@example.org',
      type: 'email',
      hashed: false
    },
    verify: {
      type: 'hosted',
      url: makeUrl(host, '/assertion.valid.json')
    },
  };
};

exports.validOldAssertion = function validOldAssertion(host) {
  return {
    recipient: 'brian@example.org',
    expires: "2019-06-01",
    issued_on: "2011-06-01",
    badge: {
      version: "0.5.0",
      name: "Pizza Badge",
      image: makeUrl(host, '/img/badge.png'),
      description: 'For Pizzaing',
      criteria: makeUrl(host, '/'),
      issuer: {
        origin: makeUrl(host, '/'),
        name: 'OpenBadges Metadata Validator',
      }
    }
  }
};

exports.validSignature = function validSignature(host) {
  var assertion = exports.validAssertion(host);
  assertion.verify.type = 'signed';
  assertion.verify.url = makeUrl(host, '/public-key');
  return exports.sign(assertion);
};

exports.sign = function sign(assertion) {
  return jws.sign({
    header: { alg: 'rs256' },
    privateKey: keys.private,
    payload: assertion
  });
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
