"use strict"

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
    var params = new user.UserObject();
    if(validParams){
      for(var i = 0; i < validParams.params.length; i++){
        var param = validParams.params[i];
        params[param] = params[param];
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
    console.log("in FindUserByUsername")
    var validParams = user.FilterParams(params);
    if(validParams && req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          var query = conn.query('select username, password from users where username = ?', params.username, function(err, result){
            if(err){
              callback({ 'error: ': err });
            }
            else if(results.length > 0){
              if(PasswordHash.verify(params.password, results[0].password)){
                callback(null, { 'username': params.username });
              }
              callback({ 'error': 'Password does not match.' });
            }
            else{
              callback(null, false);
            }
          });
          console.log(query,sql);
          conn.release();
        }
      });
    }
    else{
      callback({ 'error': 'Database not available.' });
    }
  },
  'AddUser': function(req, params, callback){
    console.log("in AddUser")
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          console.log('got connection')
          var validPassword = user.ValidPassword(params.password);
          // Check if username already exists.
          user.FindUserByUsername(req, params, function(err, user){

            if(err){
              callback({ 'error: ': err });
            }
            if(user){
              callback(null, false);
            }
            else {
              var params = user.FilterParams(params);
              // We won't ever store the plain text password so overwrite it with
              // the generated hashed value.
              var sqlparams = GetCreateUserParams(params);
              console.log(sqlparams)
              params.password = PasswordHash.generate(params.password);
              console.log(params);
              var query = conn.query('insert into users (' + sqlparams + ') SET ?', params, function(err, result){
                if(err){
                  callback({ 'error: ': err });
                }
                else if(results.length > 0){
                  if(PasswordHash.verify(params.password, results[0].password)){
                    callback(null, { 'username': params.username });
                  }
                  callback({ 'error': 'Password does not match.' });
                }
                callback({ 'error': 'Could not find user.' });
              });
              console.log(query, sql);
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
  }
};

module.export = user;