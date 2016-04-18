var express = require('express');
var router = express.Router();

var debug = require('debug')('gistboard:api');
var https = require('https');

function listGists(callback) {
  var options = {
    hostname: 'api.github.com',
    path: '/gists/public',
    headers: {
      'User-Agent': 'gistboard'
    }
  };

  https.get(options, function(res) {
    debug('status: ' + res.statusCode);
    debug('headers: ' + JSON.stringify(res.headers));

    var body = [];
    debug('reading response body');
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body.push(chunk);
    });
    res.on('end', function() {
      debug('end event');
      // If separator is an empty string, all elements are joined without any characters in between them.
      var bodyStr = body.join('');
      var bodyObj;
      try {
        bodyObj = JSON.parse(bodyStr);
      } catch(e) {
        return callback('Failed to parse body: ', e.message);
      }
      return callback(null, bodyObj);
    });
  }).on('error', function(err) {
    return callback(new Error('Failed to retrieve data for given URL: %s\nReason: %s', url, err.message));
  });
}

router.get('/gists', function(req, res, next) {
  listGists(function(err, gists) {
    if (err) {
      next(err);
    }
    res.json(gists);
  });
});

module.exports = router;