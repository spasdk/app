/**
 * Static files reload on change.
 *
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
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
