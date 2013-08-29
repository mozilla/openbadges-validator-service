var request = require('supertest');
var utils = require('./utils');

describe('App', function() {
  var app = utils.buildApp({
    defineExtraRoutes: function(app) {
      app.get('/no_js', function(req, res) {
        return res.send(res.locals.NO_JS);
      });
    }
  });

  it('should not set NO_JS local by default', function(done) {
    request(app)
      .get('/no_js')
      .expect(200)
      .expect('', done);
  });

  it('should set NO_JS local', function(done) {
    request(app)
      .get('/no_js?no_js=1')
      .expect(200)
      .expect('true', done);
  });
});
