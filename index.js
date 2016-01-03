/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Model  = require('cjs-model'),
    router = require('spa-router'),
    app;


/**
 * @instance
 * @type {Model}
 */
app = new Model({
    /**
     * Timestamps data.
     *
     * @type {Object}
     * @property {number} init application initialization time (right now)
     * @property {number} load document onload event
     * @property {number} done onload event sent and processed
     */
    time: {
        init: +new Date(),
        load: 0,
        done: 0
    }
});


app.defaultEvents = {
    /**
     * The load event is fired when a resource and its dependent resources have finished loading.
     *
     * Control flow:
     *   1. Global handler.
     *   2. Each page handler.
     *   3. Application DONE event.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/load
     *
     * @param {Event} event generated object with event data
     */
    load: function ( event ) {
        //var path;

        debug.event(event);

        // time mark
        app.data.time.load = event.timeStamp;

        // global handler
        // there are some listeners
        if ( app.events[event.type] ) {
            // notify listeners
            app.emit(event.type, event);
        }

        // local handler on each page
        router.pages.forEach(function forEachPages ( page ) {
            debug.log('component ' + page.constructor.name + '.' + page.id + ' load', 'green');

            // there are some listeners
            if ( page.events[event.type] ) {
                // notify listeners
                page.emit(event.type, event);
            }
        });

        // time mark
        app.data.time.done = +new Date();

        // everything is ready
        // and there are some listeners
        if ( app.events['done'] ) {
            // notify listeners
            app.emit('done', event);
        }
    },

    /**
     * The unload event is fired when the document or a child resource is being unloaded.
     *
     * Control flow:
     *   1. Each page handler.
     *   2. Global handler.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/unload
     *
     * @param {Event} event generated object with event data
     */
    unload: function ( event ) {
        debug.event(event);

        // global handler
        // there are some listeners
        if ( app.events[event.type] ) {
            // notify listeners
            app.emit(event.type, event);
        }

        // local handler on each page
        router.pages.forEach(function forEachPages ( page ) {
            debug.log('component ' + page.constructor.name + '.' + page.id + ' unload', 'red');

            // there are some listeners
            if ( page.events[event.type] ) {
                // notify listeners
                page.emit(event.type, event);
            }
        });
    },

    /**
     * The error event is fired when a resource failed to load.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/error
     *
     * @param {Event} event generated object with event data
     */
    error: function ( event ) {
        debug.event(event);
    },

    /**
     * The keydown event is fired when a key is pressed down.
     * Set event.stop to true in order to prevent bubbling.
     *
     * Control flow:
     *   1. Current active component on the active page.
     *   2. Current active page itself.
     *   3. Application.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keydown
     *
     * @param {Event} event generated object with event data
     */
    keydown: function ( event ) {
        var page = router.current,
            activeComponent;

        if ( DEBUG ) {
            if ( !page ) { throw new Error(__filename + ': app should have at least one page'); }
        }

        // filter phantoms
        if ( event.keyCode === 0 ) { return; }

        // combined key code
        event.code = event.keyCode;

        // apply key modifiers
        if ( event.shiftKey ) { event.code += 1000; }
        if ( event.altKey )   { event.code += 2000; }

        debug.event(event);

        // page.activeComponent can be set to null in event handles
        activeComponent = page.activeComponent;

        // current component handler
        if ( activeComponent && activeComponent !== page ) {
            // component is available and not page itself
            if ( activeComponent.events[event.type] ) {
                // there are some listeners
                activeComponent.emit(event.type, event);
            }

            // bubbling
            if (
                !event.stop &&
                activeComponent.propagate &&
                activeComponent.parent &&
                activeComponent.parent.events[event.type]
            ) {
                activeComponent.parent.emit(event.type, event);
            }
        }

        // page handler
        if ( !event.stop ) {
            // not prevented
            if ( page.events[event.type] ) {
                // there are some listeners
                page.emit(event.type, event);
            }

            // global app handler
            if ( !event.stop ) {
                // not prevented
                if ( app.events[event.type] ) {
                    // there are some listeners
                    app.emit(event.type, event);
                }
            }
        }

        //// suppress non-printable keys in stb device (not in your browser)
        //if ( app.data.host && keyCodes[event.code] ) {
        //    event.preventDefault();
        //}
    },

    /**
     * The keypress event is fired when press a printable character.
     * Delivers the event only to activeComponent at active page.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keypress
     *
     * @param {Event} event generated object with event data
     * @param {string} event.char entered character
     */
    keypress: function ( event ) {
        var page = router.current;

        if ( DEBUG ) {
            if ( page === null || page === undefined ) { throw new Error(__filename + ': app should have at least one page'); }
        }

        //debug.event(event);

        // current component handler
        if ( page.activeComponent && page.activeComponent !== page ) {
            // component is available and not page itself
            if ( page.activeComponent.events[event.type] ) {
                // there are some listeners
                page.activeComponent.emit(event.type, event);
            }
        }
    },

    /**
     * The click event is fired when a pointing device button (usually a mouse button) is pressed and released on a single element.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/click
     *
     * @param {Event} event generated object with event data
     */
    click: function ( event ) {
        debug.event(event);
    },

    /**
     * The contextmenu event is fired when the right button of the mouse is clicked (before the context menu is displayed),
     * or when the context menu key is pressed (in which case the context menu is displayed at the bottom left of the focused
     * element, unless the element is a tree, in which case the context menu is displayed at the bottom left of the current row).
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/contextmenu
     *
     * @param {Event} event generated object with event data
     */
    contextmenu: function ( event ) {
        //var kbEvent = {}; //Object.create(document.createEvent('KeyboardEvent'));

        debug.event(event);

        //kbEvent.type    = 'keydown';
        //kbEvent.keyCode = 8;

        //debug.log(kbEvent.type);

        //globalEventListenerKeydown(kbEvent);
        //var event = document.createEvent('KeyboardEvent');
        //event.initEvent('keydown', true, true);

        //document.dispatchEvent(kbEvent);

        if ( !DEBUG ) {
            // disable right click in release mode
            event.preventDefault();
        }
    },

    /**
     * The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
     *
     * @param {Event} event generated object with event data
     */
    mousewheel: function ( event ) {
        var page = router.current;

        if ( DEBUG ) {
            if ( page === null || page === undefined ) { throw new Error(__filename + ': app should have at least one page'); }
        }

        debug.event(event);

        // current component handler
        if ( page.activeComponent && page.activeComponent !== page ) {
            // component is available and not page itself
            if ( page.activeComponent.events[event.type] ) {
                // there are some listeners
                page.activeComponent.emit(event.type, event);
            }
        }

        // page handler
        if ( !event.stop ) {
            // not prevented
            if ( page.events[event.type] ) {
                // there are some listeners
                page.emit(event.type, event);
            }
        }
    }
};


// apply events
Object.keys(app.defaultEvents).forEach(function ( name ) {
    window.addEventListener(name, app.defaultEvents[name]);
});


// public
module.exports = app;
