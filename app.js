var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url');
var querystring = require('querystring');
var routes = require('./routes');
var users = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.set('port',process.env.PORT || 8000);
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.get('/',function(req,res,next){
    
    res.render('index');
    res.end();
})

app.get('/data',function(req,res){
    var result = "";
    var url = "https://maps.googleapis.com/maps/api/place/radarsearch/json?location=42.366029,-71.085838&radius=800&types=restaurant|bakery|bar|cafe&key=AIzaSyCP-j5RWqQPLnhUXt3P4RdUMVqpkz_VKxI";
    https.get(url, function(response) {
        response.on('data', function(data) {
            result += data.toString();
        });
        response.on('end', function() {
            res.send(result);
            res.end();
        });
    });
})

http.createServer(app).listen(app.get('port'),function(){
    console.log('Express server listening on port '+ app.get('port'));
})

module.exports = app;
