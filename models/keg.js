var keg = {
  'IsActive': function(id){
    if(id && req.pool){
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
};

module.exports = user;