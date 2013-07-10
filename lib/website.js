const validator = require('openbadges-validator');
const dataurl = require('dataurl');

exports.validate = function validate(req, res, next) {
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
  }
