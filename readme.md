Application core
================

[![NPM version](https://img.shields.io/npm/v/spa-app.svg?style=flat-square)](https://www.npmjs.com/package/spa-app)
[![Dependencies Status](https://img.shields.io/david/spasdk/app.svg?style=flat-square)](https://david-dm.org/spasdk/app)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/spasdk)


Main module to create SPA application.
It's an instance of [Model](https://github.com/cjssdk/model) module.
Contains common data used by other modules, handles global events.
Can be used as a common events bus.


## Installation ##

```bash
npm install spa-app
```


## Usage ##

Add the instance to the scope:

```js
var app = require('spa-app');
```

At run-time has the following attributes:

 Name          | Description
---------------|-------------
 app.data.time | Different timestamps marks.


## Development mode ##

> There is a global var `DEVELOP` which activates additional consistency checks and protection logic not available in release mode.


## Contribution ##

If you have any problem or suggestion please open an issue [here](https://github.com/spasdk/app/issues).
Pull requests are welcomed with respect to the [JavaScript Code Style](https://github.com/DarkPark/jscs).


## License ##

`spa-app` is released under the [MIT License](license.md).
