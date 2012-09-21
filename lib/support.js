
var path = require('path');

var yuiPath = 
    exports.yuiPath = 
    path.resolve(__dirname + '/../support/yuicompressor-2.4.7.jar');

var uglifyPath = 
    exports.uglifyPath =
    path.resolve(__dirname + '/../support/uglify/bin/uglifyjs');

exports.fileType = function(file) {
    if (/\.css$/.test(file)) {
        return 'css';
    }else if (/\.js$/.test(file)) {
        return 'js';
    }else {
        return '';
    };
};

exports.yui = function(_in, _out, options, type) {
    var args = [
        '-jar',
        '-Xss2048k',
        yuiPath
    ];

    //if (_out) args.push('-o', _out);
    if (type) args.push('--type', type);
    if (options) args.push(options);
    
    return {
        command:'java',
        args:args
    };
};

exports.uglify = function(_in, _out, options) {
    var args = [];

    if (_out) command.push('-o', _out);
    if (options) command.push(options);
    
    return {
        command:uglifyPath,
        args:args
    };
};

exports.concat = function(_in, _out, options) {
    var args = [];

    if (options) command.push(options);

    return {
        command:'cp',
        args:args
    };
};

