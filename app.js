var express = require('express');
var routes = require('./routes');
var path = require('path');
var lessMiddleware = require('less-middleware');

var app = express();

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');

app.use('/caltrainrunner/', lessMiddleware(__dirname + '/public', {compress: true}));
app.use('/caltrainrunner/', express.static(path.join(__dirname, 'public')));

app.use('/caltrainrunner/', app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Routes
app.get('/', routes.index);
app.get('/get_departures', routes.get_departures)
app.get('/get_games', routes.get_games)

app.listen(3000);
