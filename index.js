var child_process = require('child_process');

module.exports = function() {
  var sha;

  var child = child_process.spawn('/usr/bin/env', ['git', 'rev-parse', 'HEAD']);

  child.stdout.on('data', function(data){
    sha = data.toString().trim();
  });

  return function(req, res, next) {
    if (sha) {
      res.setHeader('X-Git-SHA', sha);
    }
    next();
  };
};
