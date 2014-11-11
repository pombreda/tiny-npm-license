'use strict';

var spawn = require('child_process').spawn;

var pkg = require('../package.json');
var test = require('tape');

test('tinyNpmLicense()', function(t) {
  t.plan(5);

  var tinyNpmLicense = require('../');

  t.equal(tinyNpmLicense({
    name: 'foo',
    licenses: ['MIT'],
    repository: {
      type: 'git',
      url: 'https://github.com/bar/baz.git'
    },
    author: 'John Smith'
  }), [
    '/*!',
    ' * foo | MIT (c) John Smith',
    ' * https://github.com/bar/baz',
    '*/\n'
  ].join('\n'), 'should create a license comment.');

  var data = {
    name: 'foo',
    licenses: ['MIT'],
    repository: 'bar/baz',
    author: 'John Smith'
  };

  t.equal(tinyNpmLicense(data), [
    '/*!',
    ' * foo | MIT (c) John Smith',
    ' * https://github.com/bar/baz',
    '*/\n'
  ].join('\n'), 'should normalize package data according to the package.json spec.');

  t.deepEqual(data, {
    name: 'foo',
    licenses: ['MIT'],
    repository: 'bar/baz',
    author: 'John Smith'
  }, 'should not modify original data.');

  t.equal(tinyNpmLicense({}, {lastNewline: false}), [
    '/*!',
    '*/'
  ].join('\n'), 'should remove the last newline using `lastNewline` option.');

  t.throws(function() {
    tinyNpmLicense({name: ' foo'}, {strict: true});
  }, /Invalid name/, 'should validate the data using `strict` option.');
});

test('"tiny-npm-license" command', function(t) {
  t.plan(8);

  var tinyNpmLicense = function(args) {
    var tinyNpmLicenseCp = spawn('node', [pkg.bin].concat(args), {
      stdio: [process.stdin, null, null]
    });
    tinyNpmLicenseCp.stdout.setEncoding('utf8');
    tinyNpmLicenseCp.stderr.setEncoding('utf8');
    return tinyNpmLicenseCp;
  };

  tinyNpmLicense(['package.json']).stdout.on('data', function(output) {
    t.equal(output, [
      '/*!',
      ' * tiny-npm-license | MIT (c) Shinnosuke Watanabe',
      ' * https://github.com/shinnn/tiny-npm-license',
      '*/\n'
    ].join('\n'), 'should print a license comment.');
  });

  var strictErr = '';
  tinyNpmLicense(['test/fixture_invalid.json', '--strict'])
  .on('close', function(code) {
    t.notEqual(code, 0, 'should fail when the validation doesn\'t passed.');
    t.ok(
      /Invalid name/.test(strictErr),
      'should print error message when the validation doesn\'t passed.'
    );
  })
  .stderr.on('data', function(output) {
    strictErr += output;
  });

  tinyNpmLicense(['test/fixture_invalid.json', '-s'])
  .on('close', function(code) {
    t.notEqual(code, 0, 'should use -s as an alias of --strict.');
  });

  var brokenJsonErr = '';
  tinyNpmLicense(['test/fixture_broken.json', '--strict'])
  .on('close', function(code) {
    t.notEqual(code, 0, 'should fail when the file content is not a valid JSON.');
    t.ok(
      /Unexpected/.test(brokenJsonErr),
      'should print error message when the file content is not a valid JSON.'
    );
  })
  .stderr.on('data', function(output) {
    brokenJsonErr += output;
  });

  var enoentErr = '';
  tinyNpmLicense(['foo'])
  .on('close', function(code) {
    t.notEqual(code, 0, 'should fail when the file doesn\'t exist.');
    t.ok(
      /ENOENT/.test(enoentErr),
      'should print error message when the file doesn\'t exist..'
    );
  })
  .stderr.on('data', function(output) {
    enoentErr += output;
  });
});

test('"tiny-npm-license" command outside a TTY context', function(t) {
  t.plan(1);

  var tinyNpmLicense = function(args) {
    var tinyNpmLicenseCp = spawn('node', [pkg.bin].concat(args), {
      stdio: ['pipe', null, null]
    });
    tinyNpmLicenseCp.stdout.setEncoding('utf8');
    return tinyNpmLicenseCp;
  };

  var cp = tinyNpmLicense([]);
  cp.stdout.on('data', function(output) {
    t.equal(output, [
      '/*!',
      ' * MIT',
      '*/\n'
      ].join('\n'), 'should print a license comment.');
  });
  cp.stdin.end('{"license": "MIT"}');
});
