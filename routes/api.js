var express = require('express');
var passport = require('passport');
var Utils = _rootRequire('utils/helpers');
var jwt = require('jsonwebtoken');

// Pull in the correct config for the environment we're running.
// Default to dev though just in case
var config = process.env.deploy_env !== 'development' ? 'config-prod' : 'config';
config = _rootRequire(config);

var User = _rootRequire('models/user');
var Recipe = _rootRequire('models/recipe');

var router = express.Router();

function ensureAuthenticated(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            }
            else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}

var response = {
    'success': false,
    'data': null
};

router.get('/', function (req, res) {
    res.render('api');
});

if (process.env.deploy_env === 'development') {
    router.route('/signup')
        .get(function (req, res) {
            res.render('admin/signup');
        })
        .post(function (req, res) {
            try {
                User.AddUser(req, req.body, function (err, user) {
                    if (err) {
                        response['Error'] = err;
                        res.json(response);
                    }
                    if (user) {
                        // if user is valid, create and return a token
                        var token = jwt.sign(user, config.secret, {
                            expiresIn: 1440 // expires in 24 hours
                        });

                        // return the information including token as JSON
                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                    }
                });
            }
            catch (e) {
                console.log(' in catch, err: ', e.message);
                response['Error'] = e.message;
                res.json(response);
            }
        });
}

router.post('/authenticate', function (req, res) {
    try {
        var params = new User.UserParams({'username': req.body.username, 'password': req.body.password});
        // This User method also checks the password
        User.FindUserByUsername(req, params, function (err, user) {
            if (err) {
                console.log(' err finding user: ', err);
                res.json(err);
            }
            if (!user) {
                console.log(' no user found: ', user);
                res.json({'error': 'Sorry, we didn\'t find a user by that username.'});
            }
            console.log(' found user: ', user);
            // if user is found and password is right
            // create a token
            var token = jwt.sign(user, config.secret, {
                expiresIn: 1440 // expires in 24 hours
            });

            // return the information including token as JSON
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });
        });
    }
    catch (e) {
        res.json({'error': e.message});
        console.error({'error': e.message});
    }
});

router.route('/keg/:kegid')
    .get(function (req, res) {
        try {
            var kegid = req.params.kegid;
            if (!kegid) {
                res.status = 400;
                res.json({'success': false, 'message': 'Please provide a kegid like so: `/api/keg/1`.'});
            }
            else {
                if (req.pool) {
                    req.pool.getConnection(function (err, conn) {
                        if (conn) {
                            var query = conn.query('call get_keg_info(?)', kegid, function (err, result) {
                                if (err) {
                                    res.json({'error': err});
                                }
                                else if (result.length === 0) {
                                    res.json({
                                        'message': 'There\'s no info for the provided data.',
                                        'data': req.params
                                    });
                                }
                                else {
                                    var keginfo = result[0][0];
                                    keginfo.keggedon = Utils.formatDateForDisplay(keginfo.keggedon);
                                    if (keginfo.lastpour) {
                                        keginfo.lastpour = Utils.dateDiff(new Date(), new Date(keginfo.lastpour));
                                    }
                                    keginfo.remainingvolume = parseFloat(keginfo.remainingvolume);
                                    res.json(keginfo);
                                }
                            });
                            console.log(query.sql);
                            conn.release();
                        }
                    });
                }
            }
        }
        catch (e) {
            res.json({'error': e.message});
            console.error({'error': e.message});
        }
    });

router.post('/keg/', ensureAuthenticated, function (req, res) {
    try {
        if (req.pool) {
            // Note:
            //  Form successfully posting, now wire up the db insert
            req.pool.getConnection(function (err, conn) {
                if (conn) {
                    res.json({
                        'success': true,
                        'params': req.body
                    });
                    // TODO: Check for currently active keg for specified id and prompt user to confirm they want to
                    // deactivate the previous entry for the current entry.
                    var query = conn.query('insert into kegs SET ?', req.body, function (err, result) {
                        if (err) {
                            res.json({'error': err});
                        }
                        else {
                            res.json({'success': 'Keg data posted successfully.', 'kegid': result.insertId});
                        }
                    });
                    conn.release();
                }
            });
        }
    }
    catch (e) {
        res.json({'error': e.message});
        console.error({'error': e.message});
    }
});

router.delete('/keg/:kegid', ensureAuthenticated, function (req, res) {
    try {
        if (req.pool) {
            req.pool.getConnection(function (err, conn) {
                if (conn) {
                    var finished = req.params.finished || new Date();
                    var query = conn.query('update kegs SET `active` = 0 where `kegsessionid` = ? and `finished` = ?', [req.params.kegid, finished], function (err, result) {
                        if (err) {
                            res.json({'error': err});
                        }
                        else {
                            res.json({'success': 'Keg successfully deactivated.', 'kegid': req.params.kegid});
                        }
                    });
                    console.log(query.sql);
                }
                conn.release();
            })
        }
    }
    catch (e) {
        res.json({'error': e.message});
        console.error({'error': e.message});
    }
});

router.route('/pour*')
    .all(function (req, res, next) {
        var kegid = req.params[0].replace('/', '');
        if (!kegid && !req.body) {
            res.send({'success': false, 'message': 'Please provide a kegid like so: `/api/pour/1`.'});
        }
        else {
            next();
        }
    });

router.get('/keg/:kegid/pour/:pourid', function (req, res) {
    try {
        if (req.pool) {
            req.pool.getConnection(function (err, conn) {
                if (conn) {
                    var query = conn.query('select volume, pourstart, pourend, temperature from pours where `kegid` = ? and `pourid` = ?', [req.params.kegid, req.params.pourid], function (err, result) {
                        if (err) {
                            res.send({'error': err});
                        }
                        else if (result.length === 0) {
                            res.send({
                                'result': [],
                                'message': 'There\'s no info for the provided data.',
                                'data': req.params
                            });
                        }
                        else {
                            res.send({'result': result});
                        }
                    });
                    conn.release();
                }
            });
        }
    }
    catch (e) {
        res.json({'error': e.message});
        console.error({'error': e.message});
    }
});

router.post('/pour/', ensureAuthenticated, function (req, res) {
    try {
        if (req.pool) {
            req.pool.getConnection(function (err, conn) {
                if (conn) {
                    // We need to remove the token property otherwise it'll throw a sql error.
                    var params = {};
                    var keys = Object.keys(req.body);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i].toLowerCase();
                        if (key !== 'token') {
                            var value = req.body[key];
                            if (key.toLowerCase() === 'pourstart') {
                                value = value.split('.')[0];
                                if (!value || !Utils.CheckDateFormat(value)) {
                                    var defaultDate = new Date();
                                    // Default the start time based on a somewhat average pour time.
                                    defaultDate = new Date(defaultDate).setSeconds(defaultDate.getSeconds() - 13);
                                    value = Utils.formatDateForInsert(defaultDate);
                                }
                            }
                            if (key.toLowerCase() === 'pourend') {
                                value = value.split('.')[0];
                                if (!value || !Utils.CheckDateFormat(value)) {
                                    var defaultDate = new Date();
                                    // Default the end time to now.
                                    value = Utils.formatDateForInsert(defaultDate);
                                }
                            }
                            params[key] = value;
                        }
                    }
                    var query = conn.query('insert into pours SET ?', params, function (err, result) {
                        if (err) {
                            res.json({'error': err});
                        }
                        else {
                            res.json({
                                'success': true,
                                'message': 'Pour posted successfully.',
                                'pourid': result.insertId
                            });
                        }
                    });
                    conn.release();
                }
            });
        }
    }
    catch (e) {
        res.json({'error': e.message});
        console.error({'error': e.message});
    }
});

router.route('/recipes/')
    .get(function (req, res) {
        try {
            Recipe.GetRecipes(req, function (err, recipes) {
                if (err) {
                    response['Error'] = err;
                }
                else if (recipes.length > 0) {
                    response['data'] = recipes[0];
                }
                res.json(response);
            });
        }
        catch (e) {
            response['Error'] = e.message;
            res.json(response);
        }
    });

router.route('/recipes/id/:id')
    .get(function (req, res) {
        try {
            if (!req.params.id) {
                res.status = 400;
                res.json({'success': false, 'message': 'Please provide a recipe id like so: `/api/keg/1`.'});
            }
            else{
                Recipe.FindRecipeByID(req, req.params, function (err, recipe) {
                    if (err) {
                        response['Error'] = err;
                        //res.render('admin/users', response);
                    }
                    else if (recipe.length > 0) {
                        response.data = recipe[0];
                        //res.render('admin/users', response);
                    }
                    else{
                        response.data = 'No recipe found';
                        //res.render('admin/users', 'No recipes found');
                    }
                    res.json(response);
                });
            }
        }
        catch (e) {
            response['Error'] = e.message;
            //res.render('admin/users', response);
            res.json(response);
        }
    });

router.route('/recipes/names')
    .get(function (req, res) {
        try {
            Recipe.ListRecipeNames(req, function (err, recipes) {
                if (err) {
                    response['Error'] = err;
                }
                else if (recipes.length > 0) {
                    response.success = true;
                    response.data = recipes;
                }
                else{
                    response['message'] = 'No recipe names found';
                }
                res.json(response);
            });
        }
        catch (e) {
            response['Error'] = e.message;
            res.json(response);
        }
    });

module.exports = router;