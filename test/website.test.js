var request = require('supertest');
var cheerio = require('cheerio');
var should = require('should');
var url = require('url');

var utils = require('./utils');
var examples = require('../').examples;

describe('Website', function() {
  var app = utils.buildApp();

  it('should return 200 OK with HTML at /', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  describe('on POST to /', function() {
    /* TODO: consider mocking validation to simplify */

    it('should return 200 OK with HTML', function(done) {
      request(app)
        .post('/')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });

    describe('with good assertion', function() {
      function goodString(post) {
        var host = url.parse(post.url).host;
        return JSON.stringify(examples.validAssertion(host));
      }

      it('should show "Valid"', function(done) {
        var post = request(app)
          .post('/');
        post
          .send({ assertion: goodString(post) })
          .expect(200, function(err, res) {
            var $ = cheerio.load(res.text);
            $('.status').text().should.match(/\bvalid\b/i);
            done();
          });
      });
    });

    describe('with bad assertion', function() {
      var badString = JSON.stringify(examples.validAssertion('NOPESORRY'));

      it('should show "Invalid"', function(done) {
        request(app)
          .post('/')
          .send({ assertion: badString })
          .expect(200, function(err, res) {
            var $ = cheerio.load(res.text);
            $('.status').text().should.match(/\binvalid\b/i);
            done();
          });
      });
    });
  });

  describe('on XHR POST to /', function() {
    /* TODO: consider mocking validation to simplify */

    describe ('with HTML accept header', function() {

      it('should always return 200 OK with HTML', function(done) {
        request(app)
          .post('/')
          .set('X-Requested-With', 'XMLHttpRequest')
          .set('Accept', 'text/html')
          .expect('Content-Type', /html/)
          .expect(200, done);
      });

    });

    describe('with JSON accept header', function() {

      it('should always return 200 OK with JSON', function(done) {
        request(app)
          .post('/')
          .set('X-Requested-With', 'XMLHttpRequest')
          .set('Accept', 'application/json')
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
            .set('X-Requested-With', 'XMLHttpRequest')
            .set('Accept', 'application/json')
            .send({ assertion: goodString(post) })
            .expect(200, function(err, res) {
              res.body.status.should.equal('valid');  
              res.body.should.have.property('info');
              res.body.should.not.have.property('error');
              done();
            });
        });
      });

      describe('with bad assertion', function() {
        var badString = JSON.stringify(examples.validAssertion('NOPESORRY'));

        it('should have status:invalid, reason, and error', function(done) {
          request(app)
            .post('/')
            .set('X-Requested-With', 'XMLHttpRequest')
            .set('Accept', 'application/json')
            .send({ assertion: badString })
            .expect(200, function(err, res) {
              res.body.status.should.equal('invalid');  
              res.body.should.have.property('reason');
              res.body.should.have.property('error');
              done();
            });
        });
      });
    });
  });
});