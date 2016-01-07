var express = require('express');
var router = express.Router();

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
              var query = conn.query('select * from kegs where ?', req.params.kegid, function(err, result){
                if(err){
                  res.send({ 'error': err });
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
    }
    catch(e){
      res.send({ 'Error': e });
      console.log({ 'Error': e });
    }
  });

router.post('/keg/', function(req, res){
  try{
    if(req.pool){
      var response = {
        'success': false
      };
      // Note:
      //  Form successfully posting, now wire up the db insert
      req.pool.getConnection(function(err, conn){
        if(conn){
          // TODO:
          //  Check for currently active keg for specified id
          //  and prompt user to confirm they want to deactivate
          //  the previous entry for the current entry.
          /*var query = conn.query('insert into kegs SET ?', req.params, function(err, result){
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
    res.send({ 'Error': e });
    console.log({ 'Error': e });
  }
});

router.route('/pour*')
  .all(function(req, res, next){
    var kegid = req.params[0].replace('/', '');
    if(!kegid){
      res.send({ 'success': false, 'message': 'Please provide a kegid like so: `/api/pour/1`.' });
    }
    else{
      next();
    }
  });

router.get('/pour/:pourid', function(req, res){
  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          var query = conn.query('select * from pours where ?', req.params.pourid, function(err, result){
            if(err){
              res.send({ 'error': err });
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
    res.send({ 'Error': e });
    console.log({ 'Error': e });
  }
});

router.post('/pour/', function(req, res){
  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          var query = conn.query('insert into pours SET ?', req.params, function(err, result){
            if(err){
              res.send({ 'error': err });
            }
            else{
              res.send({ 'success': 'Pour posted successfully.', 'pourid': results.insertId });
            }
          });
          conn.release();
        }
      });
    }
  }
  catch(e){
    res.send({ 'Error': e });
    console.log({ 'Error': e });
  }
});

module.exports = router;