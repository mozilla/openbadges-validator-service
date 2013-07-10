#!/usr/bin/env node

const PORT = process.env['PORT'] || 8888;

var app = require('../').app.build();
app.listen(PORT, function() {
  console.log("Listening on port " + PORT + ".");
});