var obvs = require('../');

exports.buildApp = function buildApp(options) {
  options = options || { logLevel: 'fatal' };
  var app =  obvs.app.build(options);
  return app;
};

exports.buildServer = function buildServer(options) {
  var app = exports.buildApp(options);
  var server = app.listen(0, function(){ 
    this.emit('ready'); 
  });
  server.on('ready', function(){
    console.log('woop woop');
  });
};
