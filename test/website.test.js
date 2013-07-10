var request = require('supertest');
var should = require('should');
var url = require('url');

var utils = require('./utils');
var examples = require('../').examples;

describe('Website', function() {
  var app = utils.buildApp();

  /* TODO: this test being here is misleading; website.js has 
           nothing to do with static content at '/' */
  it('should return 200 OK with HTML at /', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  describe('on POST to /', function() {
    /* TODO: consider mocking validation to simplify */

    it('should always return 200 OK with JSON', function(done) {
      request(app)
        .post('/')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    describe('with good assertion', function() {
      function goodString(post) {
        var host = url.parse(post.url).host;
        return JSON.stringify(examples.validAssertion(host));
      }

      it('should have status:valid and info', function(done) {
        var post = request(app)
          .post('/');
        post
          .send({ assertion: goodString(post) })
          .expect(200, function(err, req) {
            req.body.status.should.equal('valid');  
            req.body.should.have.property('info');
            req.body.should.not.have.property('error');
            done();
          });
      });
    });

    describe('with bad assertion', function() {
      var badString = JSON.stringify(examples.validAssertion('NOPESORRY'));

      it('should have status:invalid, reason, and error', function(done) {
        request(app)
          .post('/')
          .send({ assertion: badString })
          .expect(200, function(err, req) {
            req.body.status.should.equal('invalid');  
            req.body.should.have.property('reason');
            req.body.should.have.property('error');
            done();
          });
      });
    });
  });
});