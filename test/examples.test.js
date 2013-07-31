var request = require('supertest');
var should = require('should');
var validator = require('openbadges-validator');

var utils = require('./utils');
var examples = require('../').examples;
var keys = require('../').keys;

describe('Examples', function() {
  var app = utils.buildApp();

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
  
    /* TODO: remove the skip and fix; test highlights a bug that causes periodic failures */
    it.skip('should return an assertion that passes validation at a later time', function(done) {
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