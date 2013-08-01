var request = require('supertest');
var should = require('should');
var validator = require('openbadges-validator');
var jws = require('jws');

var utils = require('./utils');
var examples = require('../').examples;
var keys = require('../').keys;

describe('Examples', function() {
  var app = utils.buildApp();

  describe('at /signature.valid', function() {
    it('should provide a signature matching the public key', function(done) {
      request(app)
        .get('/signature.valid')
        .expect(200)
        .end(function(err, res) {
          if (err)
            return done(err);
          jws.verify(res.text, keys.public).should.be.true;
          done();
        });
    });
  });

  describe('at /public-key', function() {
    it('should return public key', function(done) {
      request(app)
        .get('/public-key')
        .expect(200)
        .end(function(err, res){
          if (err)
            return done(err);
          res.text.should.equal(keys.public.toString());
          done();
        });
    });
  });

  describe('at /oldassertion.valid.json', function() {
    var url = '/oldassertion.valid.json';

    it('should return 200 OK with JSON', function(done) {
      request(app)
        .get(url)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return an assertion that passes validation', function(done) {
      request(app)
        .get(url)
        .expect(200, function(err, req){
          validator(req.body, function(err, info) {
            done(err);
          });
        });
    });
  });
 
  describe('at /assertion.valid.json', function() {
    var url = '/assertion.valid.json';

    it('should return 200 OK with JSON', function(done) {
      request(app)
        .get(url)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return an assertion that passes validation', function(done) {
      request(app)
        .get(url)
        .expect(200, function(err, req){
          validator(req.body, function(err, info) {
            done(err);
          });
        });
    });
  
    it('should return an assertion that passes validation at a later time', function(done) {
      request(app)
        .get(url)
        .expect(200, function(err, req){
          setTimeout(function() {
            validator(req.body, function(err, info) {
              done(err);
            });
          }, 1000);
        });
    });
  });
});