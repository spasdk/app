/**
 * Static files reload on change.
 *
 * @module stb/develop/static
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

//var tag = require('spa-dom').tag;


//window.LiveReloadOptions = {port: LIVERELOAD.port};
window.LiveReloadOptions = {
    host: location.hostname,
    port: LIVERELOAD.port || 35729
};
//console.log(require('spa-gulp-livereload/config').default.tinylr);
//console.log(LIVERELOAD);

require('livereload-js/dist/livereload.js');

// livereload activation
//if ( config.livereload ) {
    // load external script
//document.head.appendChild(tag('script', {
//    type: 'text/javascript',
//    src: '/node_modules/livereload-js/dist/livereload.js?host=' + location.hostname + '&port=' + LIVERELOAD.port
//}));
//}
