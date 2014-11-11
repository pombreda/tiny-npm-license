# tiny-npm-license

[![Build Status](https://travis-ci.org/shinnn/tiny-npm-license.svg?branch=master)](https://travis-ci.org/shinnn/tiny-npm-license)
[![Build status](https://ci.appveyor.com/api/projects/status/eu8i55bf6wr9v63a?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/tiny-npm-license)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/tiny-npm-license.svg)](https://coveralls.io/r/shinnn/tiny-npm-license)
[![Dependency Status](https://david-dm.org/shinnn/tiny-npm-license.svg)](https://david-dm.org/shinnn/tiny-npm-license)
[![devDependency Status](https://david-dm.org/shinnn/tiny-npm-license/dev-status.svg)](https://david-dm.org/shinnn/tiny-npm-license#info=devDependencies)

A [Node](http://nodejs.org/) module to create a tiny JavaScript license comment from [package.json] data

```javascript
var tinyNpmLicense = require('tiny-npm-license');
var pkg = require('./package.json');

tinyNpmLicense(pkg);
//=>
/*!
 * tiny-npm-license | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/tiny-npm-license
*/

```

## Installation

[![NPM version](https://badge.fury.io/js/tiny-npm-license.svg)](https://www.npmjs.org/package/tiny-npm-license)

[Use npm.](https://www.npmjs.org/doc/cli/npm-install.html)

```sh
npm install tiny-npm-license
```

## API

```javascript
var tinyNpmLicense = require('tiny-npm-license');
```

### tinyNpmLicense(*packageData*,[ *options*])

*packageData*: `Object`  
*options*: `Object`  
Return: `String`

It takes an object of [package.json] data, and returns a string of JavaScript block comment which represents the license of the package.

```javascript
tinyNpmLicense({name: 'foo', author: 'John Smith'});
//=>
/*!
 * foo | (c) John Smith
*/

```

It normalizes the data with [normalize-package-data] before creating the comment.

```javascript
tinyNpmLicense({name: 'foo', repository: 'bar/baz'});
//=>
/*!
 * foo
 * https://github.com/bar/baz
*/

```

#### options.strict

Type: `Boolean`  
Default: `false`

Activate [strict validation](https://github.com/npm/normalize-package-data#strict-mode) of [normalize-package-data].

```javascript
tinyNpmLicense({name: ' foo'}, {strict: true}); // Error: Invalid name: " foo"
```

#### option.lastNewline

Type: `Boolean`  
Default: `true`

Setting this option `false` removes the last newline from the result.

```javascript
var json = {name: 'foo'};

tinyLicense(json);                       //=> '/*!\n * foo\n*/\n'
tinyLicense(json, {lastNewline: false}); //=> '/*!\n * foo\n*/'
```

## CLI

You can use this module as a CLI tool by installing it [globally](https://www.npmjs.org/doc/files/npm-folders.html#global-installation).

```sh
npm install -g tiny-npm-license
```

### Usage

```sh
Usage1: tiny-npm-license <json file path>
Usage2: cat <json file path> | tiny-npm-license

Options:
--strict,  -s  Validate the data
--help,    -h  Print usage information
--version, -v  Print version
```

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[normalize-package-data]: https://github.com/npm/normalize-package-data
[package.json]: https://www.npmjs.org/doc/files/package.json.html
