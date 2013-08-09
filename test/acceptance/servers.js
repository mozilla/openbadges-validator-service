var async = require('async');

var pingUntilReady = require('./ping-until-ready');
var serverProcesses = [];

exports.start = function start(project, cb) {
  var serverProcess = project.startServer();
  pingUntilReady(project.url, 3000, cb);
  serverProcess.on('exit', function(code, signal) {
    serverProcess.exited = true;
    if (code != 0)
      throw new Error("server process of " +
                      project.name + " exited with code " + code);
  });
  serverProcesses.push(serverProcess);
  return serverProcess;
};

exports.stop = function stop(serverProcess, cb) {
  if (serverProcess.exited) return cb();
  serverProcess.removeAllListeners();
  serverProcess.on('error', cb);
  serverProcess.on('exit', cb);
  serverProcess.kill('SIGKILL');
};

exports.stopAll = function stopAll(cb) {
  async.map(serverProcesses, exports.stop, cb.bind(null, null));
};
