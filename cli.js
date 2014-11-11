#!/usr/bin/env node
'use strict';

var fs = require('fs');

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    s: 'strict',
    h: 'help',
    v: 'version'
  },
  string: ['_'],
  boolean: ['strict', 'help', 'version']
});
var pkg = require('./package.json');

function help() {
  var chalk = require('chalk');

  console.log([
    chalk.cyan(pkg.name) + chalk.gray(' v' + pkg.version),
    pkg.description,
    '',
    'Usage1: ' + pkg.name + ' <json file path>',
    'Usage2: cat <json file path> | ' + pkg.name,
    '',
    'Options:',
    chalk.yellow('--strict,  -s') + '  Validate the data',
    chalk.yellow('--help,    -h') + '  Print usage information',
    chalk.yellow('--version, -v') + '  Print version',
    ''
  ].join('\n'));
}

function run(str) {
  var json = JSON.parse(str.replace(/^\ufeff/g, ''));
  process.stdout.write(require('./')(json, {strict: argv.strict}));
}

if (argv.version) {
  console.log(pkg.version);
} else if (argv.help) {
  help();
} else if (process.stdin.isTTY) {
  if (argv._.length === 0) {
    help();
  } else {
    run(fs.readFileSync(argv._[0], {encoding: 'utf8'}));
  }
} else {
  require('get-stdin')(run);
}
