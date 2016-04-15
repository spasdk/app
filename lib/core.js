/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

/* eslint no-path-concat: 0 */

'use strict';

var Emitter = require('cjs-emitter'),
    parse   = require('cjs-query').parse,
    app     = new Emitter();


// url request params
app.query = parse(document.location.search.substring(1));


// global application configuration
// in config.js file in js root
app.config = require('app:config');


// public
module.exports = app;
