/*!
 * tiny-npm-license | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/tiny-npm-license
*/
'use strict';

var tinyLicense = require('tiny-license');
var normalizePackageData = require('normalize-package-data');

module.exports = function tinyNpmLicense(data, options) {
  options = options || {};

  if (typeof data !== 'object') {
    var msg = 'First argument should be an object.';
    if (arguments.length === 0) {
      msg = 'More than one argument required. ' + msg;
    }
    throw new TypeError(msg);
  }

  data = Object.create(data);
  normalizePackageData(data, options.strict);
  return tinyLicense(data, options);
};
