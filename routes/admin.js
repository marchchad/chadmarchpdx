// Import required libraries
var express = require('express');
var regex = require('regex');

// Pull in the correct config for the environment we're running.
// Default to dev though just in case
var config = process.env.NODE_ENV !== 'development' ? 'config-prod' : 'config';

config = _rootRequire(config);

// Pull in authentication libraries and set up
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
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

function ValidPassword(password){
  var hasCapital = new regex('^[A-Z]*$');
  var hasSpecial = new regex(/[\[\]\^\$\.\|\?\*\+\(\)\\~`\!@#%&\-_+={}'""<>:;, ]{1,}/);

  var response = {
    'valid': null,
    'message': 'You are missing the following requirements:'
  };

  if(!hasCapital(password)){
    response.valid = false;
    response.message += '<br>Password must contain at least 1 uppercase letter';
  }

  if(!hasSpecial(password)){
    response.valid = false;
    response.message += '<br>Password must contain at least 1 special character.';
  }

  if(password.length < 7){
    response.valid = false;
    repsonse.message += '<br>Password must be at least 8 characters.';
  }

  if(!response.valid){
    return response;
  }

  // If we've gotten this far, the password is valid.
  return true;
};

// This routes to the http[s]://{site.com}/admin/ homepage
// not http[s]://{site.com}/
router.get('/', ensureAuthenticated, function(req, res){
  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          var query = conn.query('select id, Name as name from recipes', function(err, result){
            if(err){
              console.log('error: ', err);
              res.send({ 'error': err });
            }
            else{
              res.render('admin', { data: { recipes: result } });
            }
          });
          conn.release();
        }
      });
    }
  }
  catch(e){
    res.send({ 'Error': e, 'env': req.env });
    console.log({ 'Error': e, 'env': req.env });
  }
});

router.route('/login')
  .get(function(req, res){
    res.render('admin/login');
  })
  .post(function(req, res){
    var response = {};
    try{
      var validPassword = ValidPassword(req.params.password);
      if(!validPassword.valid){
        res.render('admin/login', validPassword);
      }
      else{
        // TODO:
        // Check that users params are valid then redirect
        res.redirect('admin/admin');
      }
    }
    catch(e){
      response["Error"] = e;
    }
    res.render('admin/login', response);
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/google', 
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
);

module.exports = router;