/**
 * @license The MIT License (MIT)
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var app = require('../core');


// public app instance
window.app = app;

// all development tools placeholder
app.develop = {};

// browser logging
window.debug = require('./debug');

// tools
require('./wamp');
require('./events');
require('./hooks');
require('./static');
