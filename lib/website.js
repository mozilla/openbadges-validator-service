const validator = require('openbadges-validator');
const dataurl = require('dataurl');
const log = require('./logger');

exports.index = function index(req, res, next) {
  res.render('index.html');
};

exports.validate = function validate(req, res, next) {
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

  var assertionOrSignature;
  try {
    assertionOrSignature = JSON.parse(assertionString);
  } catch(e) {
    /* Assume signature and move on */
    assertionOrSignature = assertionString;
  }

  res.locals.assertion = assertionOrSignature;

  const startTime = new Date();
  log.info({ 
    assertion: assertionOrSignature
  }, 'Validating');

  validator(assertionOrSignature, function (err, info) {

    const responseTime = new Date() - startTime;
    log.info({ 
      assertion: assertionOrSignature,
      err: err,
      responseTime: responseTime,
      validation: info
    }, 'Validation result');

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

