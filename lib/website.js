const validator = require('openbadges-validator');
const dataurl = require('dataurl');

exports.index = function index(req, res, next) {
  res.render('index.html');
};

exports.validate = function validate(req, res, next) {
  var assertion;

  var respond;
  if (req.accepts(['html', 'json']) === 'json') {
    respond = function respondJson(obj) {
      return res.json(200, obj);
    };
  }
  else {
    respond = function respondHtml(obj) {
      var template = req.xhr ? 'response.html' : 'index.html';
      return res.render(template, {
        valid: obj.status === 'valid',
        response: obj
      });
    };
  }

  const assertionString = req.body.assertion || null;
  if (!assertionString)
    return respond({
      status: 'invalid',
      reason: 'missing assertion',
      error: {}
    });

  res.locals.assertionString = assertionString;

  try {
    assertion = JSON.parse(assertionString);
  } catch(e) {
    return respond({
      status: 'invalid',
      reason: 'Could not parse string as JSON',
      error: e.message
    });
  }

  res.locals.assertion = assertion;

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
      return respond({
        status: 'invalid',
        reason: err.message,
        error: err,
        info: info
      });

    return respond({
      status: 'valid',
      info: info
    });
  });
};

