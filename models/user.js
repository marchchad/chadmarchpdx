var PasswordHash = require('password-hash');

var hasCapital = new RegExp(/[A-Z]/);
var hasSpecial = new RegExp(/[\[\]\^\$\.\|\?\*\+\(\)\\~`\!@#%&\-_+={}'""<>:;, ]{1,}/);

var User = {
    'UserObject': function () {
        this.username = null;
        this.password = null;
        this.email = null;
        this.role = null;
        this.userid = null;
    },
    'UserParams': function (params) {
        var validParams = User.FilterParams(params);
        var userParams = new User.UserObject();
        if (validParams.length < 0) {
            return false;
        }
        else {
            for (var i = 0; i < validParams.length; i++) {
                var param = validParams[i];
                userParams[param] = params[param];
            }
        }
        return userParams;
    },
    /**
     * Checks the given parameter object against the allowed insert parameters
     * @param  {Object} params
     * @return {Array} validParams
     */
    'FilterParams': function (params) {
        var keys = Object.keys(params);
        var validParams = [];
        var userParams = Object.keys(new User.UserObject());
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (userParams.indexOf(key) > -1 && typeof params[key] === "string") {
                validParams.push(key);
            }
        }
        return validParams;
    },

    /**
     * A reusable database result/callback method.
     * @param callback
     * @param err
     * @param result
     * @private
     */
    '_QueryCallback': function (callback, err, result) {
        if (err) {
            console.error('error: ', err);
            callback({'error': err});
        }
        else if (result.length > 0) {
            callback(null, result || true);
        }
        else {
            callback(null, false);
        }
    },
    /**
     * A reusable database query method;
     * @param req
     * @param query
     * @param params
     * @param callback
     * @private
     */
    '_Query': function(req, query, params, callback){
        User.ErrorMessage = User.ErrorMessage || 'An error occurred attempting to retrieve the requested data. Please try again at a later time.';
        try {
            req.pool.getConnection(function (err, conn) {
                if (err) {
                    console.error(err.message);
                    callback({'error': User.ErrorMessage});
                }
                else if (conn) {
                    var qc = User._QueryCallback.bind(null, callback);
                    if(params){
                        conn.query(query, params, qc);
                    }
                    else {
                        conn.query(query, qc);
                    }
                    conn.release();
                }
                else {
                    callback({'error': User.ErrorMessage})
                }
            });
        }
        catch(e){
            console.error(e);
            callback({'error': User.ErrorMessage});
        }
    },
    /**
     * Calls a stored procedure to get a list of user objects.
     * @param req
     * @param callback
     * @constructor
     */
    'GetUsers': function (req, callback) {
        if (req.pool) {
            var query = 'call get_users';
            User._Query(req, query, null, callback);
        }
        else {
            callback({'error': 'Database not available.'});
        }
    },
    /**
     * Finds the user in the database using the username and password
     * provided in the params object.
     * @param  {Object} req
     * @param  {Object} params
     * @param  {Function} callback
     * @return {undefined}
     */
    'FindUserByUsername': function (req, params, callback) {
        var validParams = new User.UserParams(params);
        if (!validParams){
            callback({'error': 'Please check the provided parameters.'});
        }
        else if(req.pool) {
            var query = 'select username, password from users where username = ?';
            User._Query(req, query, validParams.username, function (err, result) {
                if (err) {
                    callback({'error': err});
                }
                else if (result.length > 0) {
                    if (PasswordHash.verify(params.password, result[0].password)) {
                        callback(null, {'username': result[0].username});
                    }
                    else {
                        console.error('Password does not match.');
                        callback({'error': 'Password does not match.'});
                    }
                }
                else {
                    console.log('No matching user found.\n', result);
                    callback(null, false);
                }
            });
        }
        else {
            callback({'error': Recipe.ErrorMessage});
        }
    },
    /**
     * Creates a new user. Checks to make sure no users exist with the same username.
     * @param req
     * @param params
     * @param callback
     * @constructor
     */
    'AddUser': function (req, params, callback) {
        var userParams = new User.UserParams(params);
        if (!userParams){
            callback({'error': 'Please check the provided parameters.'});
        }
        else if(req.pool) {
            var validPassword = User.ValidPassword(params.password);
            if (!validPassword.valid) {
                callback({'error': validPassword.message});
                return;
            }
            User.FindUserByUsername(req, params, function (err, result) {
                if (err) {
                    callback({'error': err});
                }
                else if (result || result.length > 0) {
                    callback({'error': 'User already exists'});
                }
                else {
                    var query = 'insert into users SET ?';
                    User._Query(req, query, params, function (err, results) {
                        if (err) {
                            callback({'error': err});
                        }
                        else if (results.affectedRows > 0) {
                            callback(null, {'username': params.username});
                        }
                    });
                }
            });
        }
        else {
            callback({'error': User.ErrorMessage});
        }
    },
    /**
     * Updates a user with the provided parameters.
     * @param req
     * @param params
     * @param callback
     * @constructor
     */
    'UpdateUser': function (req, params, callback) {
        var userParams = new User.UserParams(params);
        if (!userParams){
            callback({'error': 'Please check the provided parameters.'});
        }
        else if(req.pool) {
            var validPassword = User.ValidPassword(params.password);
            if (!validPassword.valid) {
                callback({'error': validPassword.message});
                return;
            }
            // Check if username already exists.
            User.FindUserByUsername(req, params, function (err, result) {
                if (err) {
                    callback({'error': err});
                }
                else if (result) {
                    // We won't ever store the plain text password so overwrite it with
                    // the generated hashed value.
                    userParams.password = PasswordHash.generate(userParams.password);
                    if(userParams.hasOwnProperty('userId')){
                        delete userParams.userId;
                    }
                    var query = 'update users SET ? where userid = ?';
                    User._Query(req, query, (userParams, userParams.userId), User._QueryCallback);
                }
            });
        }
        else {
            callback({'error': User.ErrorMessage});
        }
    },
    'GetCreateUserParams': function (keys) {
        var minValues = 'username, password';
        var email = minValues + ', email';
        var role = minValues + ', role';
        var allParams = email + ', role';

        var values = minValues;

        if (keys.hasOwnProperty('email') && !keys.hasOwnProperty('role')) {
            values = email;
        }
        else if (!keys.hasOwnProperty('email') && keys.hasOwnProperty('role')) {
            values = role;
        }
        else if (keys.hasOwnProperty('email') && keys.hasOwnProperty('role')) {
            values = allParams;
        }
        return values;
    },
    'ValidPassword': function (password) {
        var response = {
            'valid': true,
            'message': ''
        };

        if (!password) {
            response.valid = false;
            response.message = 'You must provide a password.';
            return response;
        }

        if (hasCapital.test(password) !== true) {
            response.valid = false;
            response.message += '<br>Password must contain at least 1 uppercase letter';
        }

        if (hasSpecial.test(password) !== true) {
            response.valid = false;
            response.message += '<br>Password must contain at least 1 special character.';
        }

        if (password.length < 7) {
            response.valid = false;
            response.message += '<br>Password must be at least 8 characters.';
        }

        return response;
    },
    'ValidUser': function (username) {
        return !hasSpecial.test(username);

    }
};

module.exports = User;