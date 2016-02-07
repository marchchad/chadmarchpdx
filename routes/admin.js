// Import required libraries
var express = require('express');

// Pull in the correct config for the environment we're running.
// Default to dev though just in case
var config = process.env.deploy_env !== 'development' ? 'config-prod' : 'config';

config = _rootRequire(config);
var User = _rootRequire('models/user');

// Pull in authentication libraries and set up
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
/*var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: config.google.client.id,
    clientSecret: config.google.client.secret,
    callbackURL: config.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      console.log('in next tick')
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));*/

passport.use('local', new LocalStrategy({
    passReqToCallback: true, // pass the req so the user model has access to the db conn pool
  },
  function(req, username, password, done) {
    var params = new User.UserParams({ 'username': username, 'password': password });
    // This User method also checks the password
    User.FindUserByUsername(req, params, function(err, user) {
      if (err) {
        console.log(' err finding user: ', err);
        return done({ 'error': err });
      }
      if (!user) {
        console.log(' no user found: ', user);
        return done({ 'error': 'Sorry, we didn\'t find a user by that username.' }, false);
      }
      console.log(' found user: ', user);
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done){
  done(null, user);
});

// If you serialize the enitre user object,
// then that is what you will get back as the 'user'
// callback param in the deserialize function and is
// what you will deserialize

// If you serialize only the user.id,
// then the 'user' callback param will be the
// user.id value.

passport.deserializeUser(function(user, done){
  done(null, user);
});

// Get instance of router
var router = express.Router();

function ensureAuthenticated(req, res, next) {
  console.log('is authenticated: ' + req.isAuthenticated());
  console.log('user: ' + req.user);
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/admin/login');
}

// This routes to the http[s]://{site.com}/admin/ homepage
// not http[s]://{site.com}/
router.get('/', ensureAuthenticated, function(req, res){
  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          var recipes = conn.query('call get_admin_data', function(err, result){
            if(err){
              console.error('error: ', err);
              res.send({
                'error': err
              });
            }
            else{
              res.render('admin/admin', {
                'data': {
                  'recipes': result[0],
                  'kegs': result[1]
                }
              });
            }
          });
          conn.release();
        }
      });
    }
  }
  catch(e){
    console.error({
      'error': e,
       'env': req.env
     });
    res.send({
      'error': e,
       'env': req.env
     });
  }
});

router.route('/login')
  .get(function(req, res){
    res.render('admin/login');
  })
  .post(passport.authenticate('local', {
    failWithError: true
  }), function(req, res){
    var response = {
      'success': false
    };
    try{
      response.success = true;
      response['redirectUrl'] = 'admin';
    }
    catch(e){
      console.log(' in error: ', e);
      response["error"] = e;
    }
    res.send(response);
  },
  function(err, req, res, next) {
    // handle error
    return res.send(err);
  });

/*router.route('/signup')
  .get(function(req, res){
    res.render('admin/signup');
  })
  .post(function(req, res){
    var response = {};
    try{
      User.AddUser(req, req.body, function(err, user){
        if(err){
          console.log('err adding user: ', err);
          response["Error"] = err;
          res.render('admin/signup', response);
        }
        if(user){
          console.log('created user: ', user);
          res.redirect('/admin');
        }
      });
    }
    catch(e){
      console.log(' in catch, err: ', e);
      response["Error"] = e;
      res.render('admin/signup', response);
    }
});*/

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/*router.get('/google', 
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

router.get('/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login'
  })
);*/

module.exports = router;