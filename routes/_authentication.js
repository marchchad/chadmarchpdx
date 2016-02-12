// TODO:
//  Finish wrapping passport for use across routers

// Pull in authentication libraries and set up
var passport = require('passport');

var authentication = {
  'Local': function(){
    "use strict"

    var LocalStrategy = require('passport-local').Strategy;
  },
  'Google': function(){
    "use strict"

    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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
    ));
  }
}

passport.use('local', new LocalStrategy({
    passReqToCallback: true, // pass the req so the user model has access to the db conn pool
  },
  function(req, username, password, done) {
    var params = new User.UserParams({ 'username': username, 'password': password });
    console.log('in param checker');
    // This User method also checks the password
    User.FindUserByUsername(req, params, function(err, user) {
      if (err) {
        console.log(' err finding user: ', err);
        return done(err);
      }
      if (!user) {
        console.log(' no user found: ', user);
        return done(null, false);
      }
      console.log(' found user: ', user);
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done){
  console.log('serializeUser: ', user);
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
  console.log('deserializeUser: ', user);
  done(null, user);
});

function ensureAuthenticated(req, res, next) {
  console.log('is authenticated: ' + req.isAuthenticated());
  console.log('user: ' + req.user);
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/admin/login');
}

module.exports = authentication;