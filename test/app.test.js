var request = require('supertest');
var _ = require('underscore');
var utils = require('./utils');

describe('App', function() {
  var app = function(extraOpts) {
    extraOpts = extraOpts || {};
    return utils.buildApp(_.extend({
      defineExtraRoutes: function(app) {
        app.get('/no_js', function(req, res) {
          return res.send(res.locals.NO_JS);
        });
      }
    }, extraOpts));
  };

  it('should not set NO_JS local by default', function(done) {
    request(app())
      .get('/no_js')
      .expect(200)
      .expect('', done);
  });

  it('should set NO_JS local from query params', function(done) {
    request(app())
      .get('/no_js?no_js=1')
      .expect(200)
      .expect('true', done);
  });

  it('should set NO_JS local from app config', function(done) {
    request(app({
      disableJavascript: true
    }))
      .get('/no_js')
      .expect(200)
      .expect('true', done);
  });
});
