#!/bin/env node

// Some env variables are only set on the production env
process.env.deploy_env = process.env.OPENSHIFT_NODEJS_IP != null ? 'production' : 'development';

// Import custom module to allow for root relative imports
require("./_rootRequire");

// Import libraries to set up application
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('mynodeapp:server');
var http = require('http');
var passport = require('passport');
//var passportSocketIo = require("passport.socketio");
//var helmet = require('helmet');

// Get mysql library
var mysql = require('mysql');
/*
// Middleware to use MySQL as session store
var MySQLStore = require('express-mysql-session');
var SessionStore = new MySQLStore ({
    'useConnectionPooling': true
  }, pool);
*/

// Begin express app creation
var app = express();

// Get routes for application
var routes = require('./routes/index');
var apiRoutes = require('./routes/api');
var adminRoutes = require('./routes/admin');

// Application config that stores JWT secret (once configured), db connection info,
// and other application secrets that we want to abstract away
// from the main codebase.
//
// Pull in the correct config for the environment we're running.
var config = process.env.deploy_env !== 'development' ? './config-prod' : './config';

config = require(config);

// Create connection pool
var pool = mysql.createPool(config.dburi);
// var pool = mysql.createPool({
//   host: config.host,
//   user: config.user,
//   passowrd: config.password
// });
// var connection = mysql.createConnection({
//   host: config.host,
//   user: config.user,
//   passowrd: config.password
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Setup favicon, logger, parsers, and template directory
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  'secret': config.secret,
  'resave': true,
  'saveUninitialized': true,
  'name': config.sessionId,
  //'store': SessionStore
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(helmet());

// Make our connection pool accessible to our routers
// This must be declared before setting the app to use our routes.
app.use(function(req, res, next){
  req.pool = pool;
  req.env = app.env;
  next();
});

// Bind routes to application
// TODO: somehow alert dev/admin of missing routes
// although it'll be somewhat obvious when pages
// aren't available
if(apiRoutes){
  app.use('/api', apiRoutes);
}
if(adminRoutes){
  app.use('/admin', adminRoutes);
}
// We set up the basic app routes last because this
// route set contains a catch all route at the end
// to redirect back home.
if(routes){
  app.use('/', routes);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('./error/fourohfour');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    err.env = app.get('env');
    res.status(err.status || 500);
    res.render('error/error', { err: err });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error/error', { err: 'Sorry, an error occurred.' });
});

/*
  Get port from environment and store in Express.
*/
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.set('port', port);

/*
  Create HTTP server.
*/
var server = http.createServer(app);

// Setup TCP server
var io = require('socket.io')(server);

/*
function onAuthorizeFail(data, message, error, accept){
  // error indicates whether the fail is due to an error or just a unauthorized client
  if(error){
    throw new Error(message);
  }
  // send the (not-fatal) error-message to the client and deny the connection
  return accept(new Error(message));
}


function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');
  accept();
}

// Setup session authoriziation
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser, //optional your cookie-parser middleware function. Defaults to require('cookie-parser')
  key:          config.sessionId,       //make sure is the same as in your session settings in app.js
  secret:       config.sectet,      //make sure is the same as in your session settings in app.js
  store:        SessionStore,        //you need to use the same sessionStore you defined in the app.use(session({... in app.js
  success:      onAuthorizeSuccess,  // *optional* callback on success
  fail:         onAuthorizeFail,     // *optional* callback on fail/error
}));
*/

// io.emit emits to all connected clients
// socket.emit emits to only the connection made on that socket
io.on('connection', function(socket){

  // TODO: log connections to run stats on visitors later
  // Geolocate based on their IP for use in populating a visitors map
  console.log('connection made');
  
  /*
    This is middleware to pass the data straight to the client
    from the program reading from the flow meter
  */
  socket.on('emitTotalPourData', function(pourData){
    console.log(pourData);
    socket.emit('pour', 
      {
        keg: pourData.keg,
        message: 'Now pouring!'
      }
    );
    io.emit('pourData', pourData);
  });
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

/*
  Listen on provided port, on all network interfaces.
*/
server.listen(port, ipaddress);
server.on('error', onError);
server.on('listening', onListening);

/*
  Normalize a port into a number, string, or false.
*/
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

/*
  Event listener for HTTP server "error" event.
*/
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/*
  Event listener for HTTP server "listening" event.
*/
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}