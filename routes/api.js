var express = require('express');
var passport = require('passport');
var utils = _rootRequire('utils/helpers');

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
        res.json({ 'success': false, 'message': 'Please provide a kegid like so: `/api/keg/1`.' });
      }
      else{
        if(req.pool){
          var response = {
            'success': false
          };
          req.pool.getConnection(function(err, conn){
            if(conn){
              var query = conn.query('call get_keg_info(?)', kegid, function (err, result) {
                if (err) {
                  res.json({ 'error': err });
                }
                else if (result.length === 0) {
                  res.json({ 'message': 'There\'s no info for the provided data.', 'data': req.params });
                }
                else {
                  var keginfo = result[0][0];
                  keginfo.keggedon = utils.formatDate(keginfo.keggedon);
                  if (keginfo.lastpour){
                    keginfo.lastpour = utils.dateDiff(new Date(), new Date(keginfo.lastpour));
                  }
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
    catch(e){
      res.json({ 'error': e });
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
          res.json({
            'success': true,
            'params': req.body
          });
          // TODO:
          //  Check for currently active keg for specified id
          //  and prompt user to confirm they want to deactivate
          //  the previous entry for the current entry.
          /*var query = conn.query('insert into kegs SET ?', req.body, function(err, result){
            if(err){
              res.json({ 'error': err });
            }
            else{
              res.json({ 'success': 'Keg data posted successfully.', 'kegid': results.insertId });
            }
          });*/
          conn.release();
        }
      });
    }
  }
  catch(e){
    res.json({ 'error': e });
    console.error({ 'error': e });
  }
});

router.delete('/keg/:kegid', ensureAuthenticated, function(req, res){
  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        if (conn) {
          var finished = req.params.finished || new Date();
          var query = conn.query('update kegs SET `active` = 0 where `kegsessionid` = ? and `finished` = ?', [req.params.kegid, finished], function(err, result){
            if(err){
              res.json({ 'error': err });
            }
            else{
              res.json({ 'success': 'Keg successfully deactivated.', 'kegid': req.params.kegid });
            }
          });
          console.log(query.sql);
        }
        conn.release();
      })
    }
  }
  catch(e){
    res.json({ 'error': e });
    console.error({ 'error': e });
  }
})

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