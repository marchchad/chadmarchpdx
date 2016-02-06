var PasswordHash = require('password-hash');

var user = {
  'UserObject': function(){
    return {
      'username': null,
      'password': null,
      'email': null,
      'role': null
    }
  },
  'UserParams': function(params){

    var validParams = user.FilterParams(params);
    var userParams = new user.UserObject();

    if(validParams.length < 0){
      return false;
    }
    else{
      for(var i = 0; i < validParams.length; i++){
        var param = validParams[i];
        userParams[param] = params[param];
      }
    }

    return params;
  },
  /**
   * Checks the given parameter object against the allowed insert parameters
   * @param  {Object} params
   * @return {Array} validParams
   */
  'FilterParams': function(params){
    var keys = Object.keys(params);
    var validParams = [];
    var userParams = Object.keys(new user.UserObject());
    for(var i = 0; i < keys.length; i++){
      var key = keys[i];
      if(userParams.indexOf(key) > -1 && typeof params[key] === "string"){
        validParams.push(key);
      }
    }
    return validParams;
  },
  /**
   * Finds the user in the database using the username and password
   * provided in the params object.
   * @param  {Object} req
   * @param  {Object} params
   * @param  {Function} callback
   * @return {undefined}
   */
  'FindUserByUsername': function(req, params, callback){
    var validParams = user.UserParams(params);
    if(validParams && req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          var query = conn.query('select username, password from users where username = ?', params.username, function(err, result){
            if(err){
              console.log('error: ', err);
              callback({ 'error': err });
            }
            else if(result.length > 0){
              console.log(' found matching user ');
              if(PasswordHash.verify(params.password, result[0].password)){
                callback(null, { 'username': result[0].username });
              }
              else{
                console.log('Password does not match.');
                callback({ 'error': 'Password does not match.' });
              }
            }
            else{
              console.log('dunno what happened\n', result);
              callback(null, false);
            }
          });
          console.log(query.sql);
          conn.release();
        }
      });
    }
    else{
      callback({ 'error': 'Database not available.' });
    }
  },
  'AddUser': function(req, params, callback){
    var userParams = user.UserParams(params);
    if(userParams && req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          var validPassword = user.ValidPassword(params.password);

          if(!validPassword.valid){
            callback({ 'error': validPassword.message });
            return;
          }
          // Check if username already exists.
          user.FindUserByUsername(req, params, function(err, result){
            if(err){
              callback({ 'error': err });
            }
            if(result){
              callback({ 'error': 'User already exists' });
            }
            else {
              // We won't ever store the plain text password so overwrite it with
              // the generated hashed value.
              var sqlparams = user.GetCreateUserParams(params);
              params.password = PasswordHash.generate(params.password);
              var query = conn.query('insert into users SET ?', params, function(err, results){
                if(err){
                  callback({ 'error': err });
                }
                else if(results.affectedRows > 0){
                  callback(null, { 'username': params.username });
                }
              });
              conn.release();
            }
          });
        }
      });
    }
    else{
      callback({ 'error': 'Database not available.' });
    }
  },
  'GetCreateUserParams': function(keys){
    var minValues = 'username, password';
    var email = minValues + ', email';
    var role = minValues + ', role';
    var allParams = email + ', role';

    var values = minValues;

    if(keys.hasOwnProperty('email') && !keys.hasOwnProperty('role')){
      values = email;
    }
    else if(!keys.hasOwnProperty('email') && keys.hasOwnProperty('role')){
      values = role;
    }
    else if(keys.hasOwnProperty('email') && keys.hasOwnProperty('role')){
      values = allParams;
    }
    return values;
  },
  'ValidPassword': function(password){
    var response = {
      'valid': null,
      'message': 'You are missing the following requirements:'
    };

    if(!password){
      response.valid = false;
      response.message = 'You must provide a password.';
      return response;
    }

    var hasCapital = new RegExp(/[A-Z]/);
    var hasSpecial = new RegExp(/[\[\]\^\$\.\|\?\*\+\(\)\\~`\!@#%&\-_+={}'""<>:;, ]{1,}/);

    if(hasCapital.test(password) !== true){
      response.valid = false;
      response.message += '<br>Password must contain at least 1 uppercase letter';
    }

    if(hasSpecial.test(password) !== true){
      response.valid = false;
      response.message += '<br>Password must contain at least 1 special character.';
    }

    if(password.length < 7){
      response.valid = false;
      repsonse.message += '<br>Password must be at least 8 characters.';
    }

    // If we've gotten this far, the password is valid.
    response.valid = true;
    response.message = "";
    return response;
  },
  'ValidUser': function(username){
    var hasSpecial = new regex(/[\[\]\^\$\.\|\?\*\+\(\)\\~`\!@#%&\-_+={}'""<>:;, ]{1,}/);
    if(hasSpecial.test(username)){
      return false;
    }
    return true;
  }
};

module.exports = user;