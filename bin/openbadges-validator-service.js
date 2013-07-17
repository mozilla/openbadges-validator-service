#!/usr/bin/env node

if ( process.env.NEW_RELIC_HOME ) {
  require( 'newrelic' );
} 

const PORT = process.env['PORT'] || 8888;

var app = require('../').app.build();
app.listen(PORT, function() {
  console.log("Listening on port " + PORT + ".");
});