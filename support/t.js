
var path = require('path');
var fs = require('fs');

var jar = 'yuicompressor-2.4.7.jar';
var file = path.resolve('../lib/node-minify.js');
var stdio = {stdio:'pipe'};
//console.log(jar, file, stdio);

var spawn = require('child_process').spawn;
var yui = spawn('java', ['-jar', jar, '--type', 'js'], stdio);

yui.stdout.setEncoding('utf8');
yui.stderr.setEncoding('utf8');

yui.stdout.on('data', console.log);
yui.stderr.on('data', console.log);

//fs.createReadStream(file).pipe(yui.stdin);
var file = fs.readFileSync(file);
yui.stdin.write(file);
yui.stdin.end();


