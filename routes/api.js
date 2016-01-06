var express = require('express');
var router = express.Router();

// This routes to the http[s]://{site.com}/api/ homepage
// not http[s]://{site.com}/

router.route('/keg*')
  .all(function(req, res, next){
    var kegid = req.params[0].replace("/", "");
    if(!kegid){
      res.send({ 'ERROR': 'Please provide a kegid like so: /api/keg/1.' });
    }
    else{
      next();
    }
  });

router.route('/keg/:kegid')
  .get(function(req, res){
    try{
      if(req.pool){
        var response = {
          'success': false
        };
        req.pool.getConnection(function(err, conn){
          if(conn){
            // TODO: get keg information with id
            response.success = true;
            response.params = req.params;
            res.send(response);
          }
        });
      }
    }
    catch(e){
      res.send({ "Error": e });
      console.log(e);
    }
  })
  .post(function(req, res){
  try{
    if(req.pool){
      var response = {
        'success': false
      };
      req.pool.getConnection(function(err, conn){
        if(conn){
          // TODO: update keg information with id
          response.success = true;
          response.params = {
            req: req.params,
            resp: req.body
          };
          res.send(response);
        }
      });
    }
  }
  catch(e){
    res.send({ "Error": e });
    console.log(e);
  }
});

router.post('/pour', function(req, res){
  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          // TODO:
          //      Send post data to db stored proc to insert
          //      pour data.
          res.send({ "Success": "Connected" });
        }
      });
    }
  }
  catch(e){
    res.send({ "Error": e });
    console.log(e);
  }
});

module.exports = router;