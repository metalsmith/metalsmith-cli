'use strict';

var mkdirp = require('mkdirp');

mkdirp('./bin', function mkdir (err) {
  if (err) {
    throw err;
  }
});
