var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io')
var spawn = require('child_process').spawn;

var routes = require('./routes/index');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


var debug = require('debug')('webconsole');
var sh; // = spawn("sh");

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});




io = io.listen(server, {
    log: true
});
console.log("stocazzo");

var MininetCtrl = require('./Control/mininet');
var p = new MininetCtrl("/tmp/my.json","my",io);
//p.provaSshClient("pwd");
//p.sendData();
// io.sockets.on('connection', function(socket) {
//     console.log('onConnection');
//     sh = spawn("/bin/sh");
//     console.log(sh.connected);
//     sh.stdout.setEncoding('utf-8');
//     sh.stdin.setEncoding('utf-8');
//     sh.stdout.on('data', function(data) {
//         console.log('data ' + data)
//         socket.emit('cmd_res', data);
//     });
//     sh.stderr.setEncoding('utf-8');
//     sh.stderr.on('data', function(data) {
//         console.log('dataerr ' + data)
//         socket.emit('cmd_res', data);
//     });
//     console.log(sh.connected);

//     socket.on('disconnect', function(data) {
//         console.log('disconnesso: onDisconnect');
//     });


//     socket.on('cmd', function(data) {
//         console.log('cmd: ' + data);
//         console.log(sh.connected);
//         sh.stdin.write(data + "\n");

//     });


// });



module.exports = app;