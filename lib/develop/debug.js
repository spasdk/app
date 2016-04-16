/**
 * Logger.
 *
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

/* eslint no-path-concat: 0 */
/* eslint new-cap: 0 */

'use strict';

var //host      = require('../app').data.host,
    app       = require('../core'),
    //util      = require('util'),
    timeMarks = {},  // storage for timers (debug.time, debug.timeEnd)
    buffer    = [],
    debug     = {},
    links     = {},
    linkId    = 0;


// debug.config = {
//     depth: 3
// };


/**
 * Check condition and warn if not match.
 *
 * @param {boolean} condition should be true if okay
 * @param {string} title description of the problem
 */
debug.assert = function ( condition, title ) {
    if ( !condition ) {
        console.assert(condition, title);
    }
};


debug.links = links;


function prepareConfig ( config ) {
    config = config || {};

    config.tags = config.tags || [];
    config.tags.push('target');

    return config;
}


function wrapData ( data ) {
    var result = {
        type: typeof data
    };

    if ( data && result.type === 'object' ) {
        result.link = linkId++;
        links[result.link] = data;

        if ( data.constructor && data.constructor.name ) {
            result.name = data.constructor.name;
        }

        if ( 'length' in data ) {
            result.size = data.length;
        }
    } else {
        result.value = data;
    }

    return result;
}


// todo: remove setTimeout hack
setTimeout(function () {
    app.develop.wamp.addListener('getLinkData', function ( params, callback ) {
        var link = links[params.id],
            data = {};

        console.log('incoming getLinkData', params);
        //console.log(link);

        if ( link ) {
            Object.keys(link).forEach(function ( name ) {
                data[name] = wrapData(link[name]);
            });
        }

        callback(null, data);
    });
}, 1000);


/**
 * Print a plain colored string.
 *
 * @param {*} message data to output
 * @param {string} [color='black'] colour to set
 */
debug.log = function ( info, data, config ) {
    // message = (message + '') || '(empty message)';
	//
    // console.log('%c%s', 'color:' + (color || 'black'), message);

    config.info = info;
    //config.data = data ? util.inspect(data, {depth: debug.config.depth}) : null;
    config.data = data !== undefined ? wrapData(data) : undefined;
    //config.data = wrapData(data);
    config.time = +new Date();
    config.targetId = app.query.wampTargetId;
    //config.tags = config.tags.sort();

    if ( app.develop.wamp.open ) {
        if ( buffer.length ) {
            buffer.forEach(function ( bufItem ) {
                app.develop.wamp.call('sendMessage', bufItem);
            });
            buffer = [];
        }

        app.develop.wamp.call('sendMessage', config);
    } else {
        buffer.push(config);
    }
};


/**
 * Print the given var with caption.
 *
 * @param {*} data data to output
 * @param {string} [title] optional caption
 */
debug.info = function ( info, data, config ) {
    /*var type = Object.prototype.toString.call(data).match(/\s([a-zA-Z]+)/)[1].toLowerCase(),
        args;

    args = ['color:' + (type === 'error' ? 'red' : 'green'), type];
    if ( title ) {
        args.unshift('%c%s\t%c%s\t');
        args.push('color:grey');
        args.push(title);
    } else {
        args.unshift('%c%s\t');
    }
    args.push(data);
    // output
    console.log.apply(console, args);*/

    config = prepareConfig(config);
    //config.tags.push('info');
    config.type = 'info';

    debug.log(info, data, config);
};


debug.warn = function ( info, data, config ) {
    config = prepareConfig(config);
    //config.tags.push('warn');
    config.type = 'warn';

    debug.log(info, data, config);
};


debug.fail = function ( info, data, config ) {
    config = prepareConfig(config);
    //config.tags.push('fail');
    config.type = 'fail';

    debug.log(info, data, config);
};


/**
 * Print the given complex var with level restriction.
 *
 * @param {*} data data to output
 */
debug.inspect = function ( data ) {
    console.log(data);
};


/**
 * Print the given event object in some special way.
 *
 * @param {Event} data event object
 */
debug.event = function ( data ) {
    var type  = data.type.toUpperCase(),
        color = type === 'ERROR' ? 'red' : 'green';

    switch ( type ) {
        case 'KEYDOWN':
        case 'KEYPRESS':
            console.log('%o\t%c%s %c%s %c%s %c%s %c%s\t%s\t%c%s', data, 'color:' + color + ';font-weight:bold', type,
                'color:' + (data.ctrlKey  ? 'green' : 'lightgrey'), 'ctrl',
                'color:' + (data.altKey   ? 'green' : 'lightgrey'), 'alt',
                'color:' + (data.shiftKey ? 'green' : 'lightgrey'), 'shift',
                'color:black', data.keyCode, data.code || '', 'color:green', data.keyIdentifier
            );
            break;
        default:
            console.log('%o\t%c%s', data, 'color:' + color + ';font-weight:bold', type);
    }
};


/**
 * Start specific timer.
 * Use to calculate time of some actions.
 *
 * @param {string} [name=''] timer group name
 * @param {string} [title=''] timer individual mark caption
 *
 * @example
 * debug.time('request');
 * // some processing...
 * debug.time('request');
 * // prints 'time: +20ms'
 * // some processing...
 * debug.time('request', 'ready');
 * // prints 'time (ready): +40ms'
 * // some processing...
 * debug.time('request', 'done');
 * // prints 'time (done): +60ms'
 */
debug.time = function ( name, title ) {
    var time = +new Date();

    // sanitize
    name  = name  || '';
    title = title || '';

    // is this mark exist
    if ( timeMarks[name] ) {
        // already set
        debug.log((name || 'time') + (title ? ' (' + title + ')' : '') + ': +' + (time - timeMarks[name].last) + 'ms', 'blue');
    } else {
        // create a new mark
        timeMarks[name] = {init: time};
    }

    // update with the current value
    timeMarks[name].last = time;
};


/**
 * End specific timer.
 * Use to calculate time of some actions.
 *
 * @param {string} [name=''] timer name
 * @param {string} [title='total'] timer mark caption
 *
 * @example
 * debug.time();
 * // some processing...
 * debug.timeEnd();
 * // prints 'time (total): 934ms'
 *
 * @example
 * debug.time('request');
 * // some processing...
 * debug.timeEnd('request', 'done');
 * // prints 'request (done): 934ms'
 */
debug.timeEnd = function ( name, title ) {
    var time = +new Date();

    // sanitize
    name  = name  || '';
    title = title || 'total';

    // is this mark exist
    if ( timeMarks[name] ) {
        debug.log((name || 'time') + ' (' + title + '): ' + (time - timeMarks[name].init) + 'ms', 'blue');

        delete timeMarks[name];
    } else {
        throw new Error(__filename + ': no started timer for "' + name + '"');
    }
};


// public
module.exports = debug;
