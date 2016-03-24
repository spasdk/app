/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var app  = require('spa-app'),
    Wamp = require('spa-wamp');


if ( app.query.wampPort ) {
    app.develop.wamp = new Wamp(
        'ws://' + (app.query.wampHost || location.hostname) + ':' + app.query.wampPort + '/target'
    );

    app.develop.wamp.addListener('connection:open', function () {
        debug.info('wamp open ' + app.develop.wamp.socket.url, null, {tags: ['open', 'wamp']});
    });

    app.develop.wamp.addListener('connection:close', function () {
        debug.info('wamp close ' + app.develop.wamp.socket.url, null, {tags: ['close', 'wamp']});
    });
}
