/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var app       = require('spa-app'),
    Wamp      = require('spa-wamp'),
    stringify = require('cjs-query').stringify;


if ( app.query.wampPort ) {
    app.develop.wamp = new Wamp(
        'ws://' + (app.query.wampHost || location.hostname) + ':' + app.query.wampPort + '/target/' + (app.query.wampTargetId || '')
    );

    app.develop.wamp.addListener('connection:open', function () {
        debug.info('wamp open ' + app.develop.wamp.socket.url, null, {tags: ['open', 'wamp']});

        // get target connection id
        app.develop.wamp.call('getConnectionInfo', {}, function ( error, data ) {
            // check if already linked
            if ( !error && parseInt(app.query.wampTargetId, 10) !== data.id ) {
                // disconnect
                app.develop.wamp.socket.close();
                // correct url
                app.query.wampTargetId = data.id;
                // bind to the target id
                location.search = '?' + stringify(app.query);
            }
        });
    });

    app.develop.wamp.addListener('connection:close', function () {
        debug.info('wamp close ' + app.develop.wamp.socket.url, null, {tags: ['close', 'wamp']});
    });
}
