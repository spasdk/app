/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var app     = require('spa-app'),
    console = window.console,
    buffer  = {
        log:   [],
        info:  [],
        warn:  [],
        error: []
    };

// public
module.exports = {
    log: console.log.bind(console),

    info: function ( data, config ) {
        //console.log(data);
        app.develop.wamp.call('sendMessage', {data: data, config: config});
    },

    assert: function ( data, config ) {
        //console.log(data);
    }
};
