#!/usr/bin/env node

var validatorService = require('../');

validatorService.logger.init();

if ( process.env.NEW_RELIC_HOME ) {
  require( 'newrelic' );
} 

const PORT = process.env['PORT'] || 8888;

var app = validatorService.app.build();
app.listen(PORT, function() {
  console.log("Listening on port " + PORT + ".");
});