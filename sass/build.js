/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs   = require('fs'),
    path = require('path'),
    sass = require('node-sass');


['develop', 'release'].forEach(function ( fileName ) {
    var dst = path.join(__dirname, '..', 'css', fileName + '.css');

    // do the magic
    sass.render({
        file: path.join(__dirname, fileName + '.scss'),
        outFile: dst,
        includePaths: [],
        outputStyle: 'nested',
        indentWidth: 4
    }, function ( error, result ) {
        if ( error ) {
            console.log(error);
        } else {
            console.log(dst);
            fs.writeFileSync(dst, result.css);
        }
    });
});
