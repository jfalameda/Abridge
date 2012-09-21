
var support = require('./support');
var spawn = require('child_process').spawn;

var fs  = require('fs');
var path = require('path');
var Suckle = require('suckle');

function Minifier() {
    var args = Array.prototype.slice.call(arguments);
    var options;

    if (typeof(args[args.length-1]) === 'function') {
        options.callback = args.pop();
    };

    switch(args[0].constructor) {
        case Object:
            options = args.shift();
        break;
        case String:
        case Array:
            options = {
                fileIn:args.shift(),
                fileOut:args.shift()
            };
        break;
    };

    switch(options.fileIn.constructor) {
        case String:
            this.fileIn =  options.fileIn;
            this.fileType = support.fileType(this.fileIn);
        break;
        case Array:
            var fileType = support.fileType(options.fileIn[0]);
            var uniform = options.fileIn.every(function(file) {
                return support.fileType(file) === fileType;
            })

            if (!uniform) {
                throw new Error('All arguments must be same file type');
            }else {
                this.fileType = fileType;
            };

            this.tempFile = options.fileIn;
            this.fileIn = null;
        break;
    };

    var css = /^css$/.test(this.fileType);

    this.buffer = options.buffer || 1000 * 1024;
    this.callback = options.callback;
    this.type   = options.type || (css  ? 'yui' : 'uglify');
    this.fileOut = options.fileOut;
};

Minifier.prototype.compress = function(fn) {
    var self = this, command;

    var getCommand = function(from) {
        var props = [
            this.fileIn, this.fileOut,
            this.options, this.fileType
        ];
        return support[from].apply(this, props);
    }.bind(this);

    switch (this.type) {
        case 'yui':
            case 'yui-css':
            case 'yui-js':
            command = getCommand('yui');
        break;
        case 'uglify':
            case 'uglifyjs':
            command = getCommand('uglify');
        break;
        case 'concat':
        case 'no-compress':
            command = getCommand('concat');
        break;
    };

    var cb = function() {
        this.tempFile = null;
        var callback = this.callback || fn;
        if (!callback) return;
        callback.apply(this, arguments);
    }.bind(this);

    var args = command.args;
    var command = command.command;
    var opts = { 
        maxBuffer:this.buffer,
        stdio:'pipe' 
    };

    var suckle = new Suckle(function(data) {
        var err = data ? null : new Error();
        cb(err, data);
    });

    if (this.fileOut) {
        var ws = fs.createWriteStream(this.fileOut);
        suckle.pipe(ws);
    };
    
    var compress = spawn(command, args, opts);

    compress.on('error', cb);
    compress.stdout.setEncoding('utf8');
    compress.stdout.pipe(suckle);

    if (this.tempFile) {
        this.tempFile.forEach(function(file) {
            fs.createReadStream(file).pipe(compress.stdin);
        });
    }else if (this.fileIn) {
        fs.createReadStream(this.fileIn).pipe(compress.stdin);
    };
};

exports.Minifier = Minifier;
exports.minify = function(options, cb) {
    return new Minifier(options).compress(cb);
};

