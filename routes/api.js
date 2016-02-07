var express = require('express');
var passport = require('passport');

var router = express.Router();

function ensureAuthenticated(req, res, next) {
  console.log('is authenticated: ' + req.isAuthenticated());
  console.log('user: ' + req.user);
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/admin/login');
}

router.get('/', function(req, res){
  res.render('api');
});

router.route('/keg/:kegid')
  .get(function(req, res){
    try{
      var kegid = req.params.kegid;
      if(!kegid){
        res.status = 400;
        res.send({ 'success': false, 'message': 'Please provide a kegid like so: `/api/keg/1`.' });
      }
      else{
        if(req.pool){
          var response = {
            'success': false
          };
          req.pool.getConnection(function(err, conn){
            if(conn){
              var query = conn.query('\
                select\
                  k.volume\
                  ,k.pressure\
                  ,k.keggedon\
                from kegs k\
                where ?\
                and k.active = 1\
                ', req.params, function(err, result){
                if(err){
                  res.send({ 'error': err });
                }
                else if(result.length === 0){
                  res.send({ 'result': [], 'message': 'There\'s no info for the provided data.', 'data': req.params });
                }
                else{
                  res.send({ 'result': result[0] });
                }
              });
              console.log(query.sql);
              conn.release();
            }
          });
        }
      }
    }
    catch(e){
      res.send({ 'error': e });
      console.error({ 'error': e });
    }
  });

router.post('/keg/', ensureAuthenticated, function(req, res){
  try{
    if(req.pool){
      // Note:
      //  Form successfully posting, now wire up the db insert
      req.pool.getConnection(function(err, conn){
        if(conn){
          res.send({
            'success': true,
            'params': req.body
          });
          // TODO:
          //  Check for currently active keg for specified id
          //  and prompt user to confirm they want to deactivate
          //  the previous entry for the current entry.
          /*var query = conn.query('insert into kegs SET ?', req.body, function(err, result){
            if(err){
              res.send({ 'error': err });
            }
            else{
              res.send({ 'success': 'Keg data posted successfully.', 'kegid': results.insertId });
            }
          });*/
          conn.release();
        }
      });
    }
  }
  catch(e){
    res.send({ 'error': e });
    console.error({ 'error': e });
  }
});

router.route('/pour*')
  .all(function(req, res, next){
    var kegid = req.params[0].replace('/', '');
    if(!kegid && !req.body){
      res.send({ 'success': false, 'message': 'Please provide a kegid like so: `/api/pour/1`.' });
    }
    else{
      next();
    }
  });

router.get('/keg/:kegid/pour/:pourid', function(req, res){
  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          var query = conn.query('select volume, pourstart, pourend, temperature from pours where `kegid` = ? and `pourid` = ?', [req.params.kegid, req.params.pourid], function(err, result){
            if(err){
              res.send({ 'error': err });
            }
            else if(result.length === 0){
              res.send({ 'result': [], 'message': 'There\'s no info for the provided data.', 'data': req.params });
            }
            else{
              res.send({ 'result': result });
            }
          });
          conn.release();
        }
      });
    }
  }
  catch(e){
    res.send({ 'error': e });
    console.error({ 'error': e });
  }
});

router.post('/pour/', ensureAuthenticated, function(req, res){
  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          var query = conn.query('insert into pours SET ?', req.body, function(err, result){
            if(err){
              res.send({ 'error': err });
            }
            else{
              res.send({ 'success': 'Pour posted successfully.', 'pourid': result.insertId });
            }
          });
          conn.release();
        }
      });
    }
  }
  catch(e){
    res.send({ 'error': e });
    console.error({ 'error': e });
  }
});

module.exports = router;