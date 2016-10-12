/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var app       = require('../core'),
    Wamp      = require('spa-wamp'),
    stringify = require('cjs-query').stringify;


if ( app.query.wampPort ) {
    // correct type
    app.query.wampTargetId = parseInt(app.query.wampTargetId, 10);

    app.develop.wamp = new Wamp(
        'ws://' + (app.query.wampHost || location.hostname) + ':' + app.query.wampPort + '/target/' + (app.query.wampTargetId || '')
    );

    app.develop.wamp.onopen = function () {
        //app.develop.wamp.addListener(app.develop.wamp.EVENT_OPEN, function () {
        debug.info('wamp open ' + app.develop.wamp.socket.url, null, {tags: ['open', 'wamp']});

        // get target connection id
        app.develop.wamp.call('getConnectionInfo', {}, function ( error, data ) {
            // check if already linked
            if ( !error && app.query.wampTargetId !== data.id ) {
                // disconnect
                app.develop.wamp.socket.close();
                // correct url
                app.query.wampTargetId = data.id;
                // bind to the target id
                location.search = '?' + stringify(app.query);
            }
        });
        //});
    };

    app.develop.wamp.onclose = function () {
        debug.info('wamp close ' + app.develop.wamp.socket.url, null, {tags: ['close', 'wamp']});
    };

    app.develop.wamp.addListener('evalCode', function ( params, callback ) {
        console.log('incoming evalCode', params);

        /* eslint no-eval: 0 */
        callback(null, {eval: eval(params.code)});
    });
}
