#!/usr/bin/env node

var validatorService = require('../');

validatorService.logger.init();

if ( process.env.NEW_RELIC_HOME ) {
  require( 'newrelic' );
} 

const PORT = process.env['PORT'] || 8888;
const NO_JS = ('NO_JS' in process.env);

var app = validatorService.app.build({
  disableJavascript: NO_JS
});
app.listen(PORT, function() {
  console.log("Listening on port " + PORT + ".");
});