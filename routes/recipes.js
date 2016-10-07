// Import required libraries
var express = require('express');

// Pull in the correct config for the environment we're running.
// Default to dev though just in case
var config = process.env.deploy_env !== 'development' ? 'config-prod' : 'config';

config = _rootRequire(config);
var User = _rootRequire('models/user');
var Recipe = _rootRequire('models/recipe');

// Pull in authentication libraries and set up
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy({
        passReqToCallback: true // pass the req so the model has access to the db conn pool
    },
    function (req, username, password, done) {
        var params = new User.UserParams({'username': username, 'password': password});
        // This User method also checks the password
        User.FindUserByUsername(req, params, function (err, user) {
            if (err) {
                console.log(' err finding user: ', err);
                return done(err);
            }
            if (!user) {
                console.log(' no user found: ', user);
                return done({'error': 'Sorry, we didn\'t find a user by that username.'}, false);
            }
            console.log(' found user: ', user);
            return done(null, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

// If you serialize the entire user object,
// then that is what you will get back as the 'user'
// callback param in the deserialize function and is
// what you will deserialize

// If you serialize only the user.id,
// then the 'user' callback param will be the
// user.id value.

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// Get instance of router
var router = express.Router();

var response = {
    'success': false,
    'data': null
};

function ensureAuthenticated(req, res, next) {
    console.log('is authenticated: ' + req.isAuthenticated());
    console.log('user: ' + req.user);
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/login');
}

router.route('/')
    .post(ensureAuthenticated, function (req, res) {
        try {
            Recipe.AddRecipe(req, req.body, function (err, recipe) {
                if (err != null) {
                    response['Error'] = err;
                }
                else if (recipe) {
                    response.success = true;
                }
                res.json(response);
            });
        }
        catch (e) {
            console.error(' in catch, err: ', e);
            response['Error'] = e;
            res.json(response);
        }
    });

router.route('/:id')
    .delete(ensureAuthenticated, function (req, res) {
        try {
            Recipe.DeleteRecipe(req, req.body, function (err, recipe) {
                if (err) {
                    response['Error'] = err;
                }
                else if (recipe) {
                    response.success = true;
                    response.message = "Recipe successfully deleted.";
                }
                res.json(response);
            });
        }
        catch (e) {
            res.json({'error': e.message});
        }
    })
    .post(ensureAuthenticated, function (req, res) {
        try {
            Recipe.UpdateRecipe(req, req.body, function (err, recipe) {
                if (err) {
                    response['Error'] = err;
                }
                else if (recipe) {
                    response.success = true;
                }
                res.json(response);
            });
        }
        catch (e) {
            console.error(' in catch, err: ', e);
            response['Error'] = e;
            res.json(response);
        }
    });

module.exports = router;