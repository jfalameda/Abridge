# Abridge

`npm install abridge`

Abridge is a wild fork of [node-minify](https://github.com/srod/node-minify) module. It is not a drop-in replacement, but improves upon the original code in various ways.

* Dropped support for Google Closure
* Do not create temporary files, pipe to chld process's stdin instead
* Use streams wherever possible
* Supply minified data to callbacks
* Major API improvements

# Usage

The old API style is mostly preserved.

```js
var Minifier = require('abridge').Minifier;

new Minifier({
    type: 'yui',
    fileIn: 'public/js/base.js',
    fileOut: 'public/js/base-min-gcc.js',
    callback: function(err){
        console.log(err);
    }
});
```

But now we can just call the `minify` function without creating an instance of Minify:

```js
var abridge = require('abridge');
var options = {
    type: 'yui',
    fileIn: 'public/js/base.js',
    fileOut: 'public/js/base-min-gcc.js',
    callback: function(err){
        console.log(err);
    }
};

abridge.minify(options);
```

We can also supply a callback as a second argument, as per tradition:

```js
var options = {
    type: 'yui',
    fileIn: 'public/js/base.js',
    fileOut: 'public/js/base-min-gcc.js'
};

abridge.minify(options, function(err) {
    console.log(err);
});
```

And our callback is given the minified data:

```js
abridge.minify(options, function(err, data) {
    console.log(err, data);
});
```

Also `fileOut` and `type` are optional. If CSS is detected, Abridge will default to YUICompressor, as uglifyjs compresses only JavaScript. However, if minifying JavaScript, Abridge will use Uglify-js instead, as it is more efficient:

```js
var options = {
    fileIn: 'public/js/base.js'
};

abridge.minify(options, console.log);
```

In fact you no longer need an options object:

```js
var fileIn = ['public/js/base.js', 'public/js/somn.js'];
var fileOut = 'public/js/common.js';
abridge.minify(fileIn, fileOut, console.log);
```

In the simplest case, we have:

```js
abridge.minify('public/js/base.js', function(err, data) {

});
```

## Note

To use YUICompressor (default for CSS files) you must have Java installed.
