/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var app = require('spa-app');


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
