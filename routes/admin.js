var express = require('express');
var router = express.Router();

// This routes to the http[s]://{site.com}/admin/ homepage
// not http[s]://{site.com}/
router.get('/', function(req, res){
    try{
      if(req.pool){
        req.pool.getConnection(function(err, conn){
          if(conn){
            var query = conn.query('select id, Name as name from recipes', function(err, result){
              if(err){
                console.log('error: ', err);
                res.send({ 'error': err });
              }
              else{
                res.render('admin', { data: { recipes: result } });
              }
            });
            conn.release();
          }
        });
      }
    }
    catch(e){
      res.send({ 'Error': e, 'env': req.env });
      console.log({ 'Error': e, 'env': req.env });
    }
});

// TODO:
//  Get Recipe name/id list to populate select when configuring a keg

module.exports = router;