/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

/* eslint no-path-concat: 0 */

'use strict';

var app = require('spa-app');


/**
 * Make the given inactive/hidden page active/visible.
 * Pass some data to the page and trigger the corresponding event.
 *
 * @param {Page} page item to show
 * @param {*} [data] data to send to page
 *
 * @return {boolean} operation status
 */
function show ( page, data ) {
    // page available and can be hidden
    if ( page && !page.active ) {
        // apply visibility
        page.$node.classList.add('active');
        page.active = true;
        app.activePage = page;

        debug.info('show component ' + page.constructor.name + '#' + page.id, null, {
            tags: ['show', 'component', page.constructor.name, page.id]
        });
        //console.log('component ' + page.constructor.name + '.' + page.id + ' show', 'green');

        // there are some listeners
        if ( page.events['show'] ) {
            // notify listeners
            page.emit('show', {page: page, data: data});
        }

        return true;
    }

    // nothing was done
    return false;
}


/**
 * Make the given active/visible page inactive/hidden and trigger the corresponding event.
 *
 * @param {Page} page item to hide
 *
 * @return {boolean} operation status
 */
function hide ( page ) {
    // page available and can be hidden
    if ( page && page.active ) {
        // apply visibility
        page.$node.classList.remove('active');
        page.active  = false;
        app.activePage = null;

        debug.info('hide component ' + page.constructor.name + '#' + page.id, null, {
            tags: ['hide', 'component', page.constructor.name, page.id]
        });
        //console.log('component ' + page.constructor.name + '.' + page.id + ' hide', 'grey');

        // there are some listeners
        if ( page.events['hide'] ) {
            // notify listeners
            page.emit('hide', {page: page});
        }

        return true;
    }

    // nothing was done
    return false;
}


app.activePage = null;


/**
 * Browse to a given page.
 * Do nothing if the link is invalid. Otherwise hide the current, show new and update the "previous" link.
 *
 * @param {Page} pageTo instance of the page to show
 * @param {*} [data] options to pass to the page on show
 *
 * @return {boolean} operation status
 */
module.exports = function ( pageTo, data ) {
    var pageFrom = app.activePage;

    if ( DEVELOP ) {
        //if ( router.pages.length > 0 ) {
        if ( !pageTo || typeof pageTo !== 'object' ) { throw new Error(__filename + ': wrong pageTo type'); }
        if ( !('active' in pageTo) ) { throw new Error(__filename + ': missing field "active" in pageTo'); }
        //}
    }

    // valid not already active page
    if ( pageTo && !pageTo.active ) {
        //debug.log('router.navigate: ' + pageTo.id, pageTo === pageFrom ? 'grey' : 'green');
        debug.info('app route: ' + pageTo.id, null, {tags: ['route', 'page', pageTo.id]});

        // update url
        //location.hash = this.stringify(name, data);

        // apply visibility
        hide(app.activePage);
        show(pageTo, data);

        // there are some listeners
        if ( this.events['route'] ) {
            // notify listeners
            this.emit('route', {from: pageFrom, to: pageTo});
        }

        // store
        //this.history.push(pageTo);

        return true;
    }

    debug.warn('invalid page to route: ' + pageTo.id, null, {tags: ['route', 'page', pageTo.id]});
    //console.log('router.navigate: ' + pageTo.id, 'red');

    // nothing was done
    return false;
};
