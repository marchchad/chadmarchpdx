var express = require('express');
var jade = require('jade');
var router = express.Router();

// There is middleware implemented in `server.js` that binds the pool instance
// to the `req` object before any of these routes are hit.

/* GET home page. */
router.get('/', function(req, res) {
  var response = {};
  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        response.hiddenMessage = "pool enabled";
        conn.release();
      });
    }
  }
  catch(e){
    response["Error"] = e;
  }
  res.render('index', response);
});

/* GET menu page. */
router.get('/ontap', function(req, res) {

  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          conn.query('call get_recipes', function(err, results){
            conn.release();
            if(err && err.errno > 0){
              res.render('menu', {
                error: err,
                message: "Bummer, looks like we are having some technical difficulties. Check back soon to see what's next!"
              });
            }
            else{
              results = results[0];
              var _recipes = [];
              for(var i = 0, len = results.length; i < len; i++){
                if(results[i].hasOwnProperty("Name")){
                  results[i]["grains"] = results[i].grains.split(",");
                  results[i]["hops"] = results[i].hops.split(",");
                  
                  _recipes.push(jade.renderFile('./views/_recipe.jade', { recipe: results[i] }));
                }
              }
              res.render('menu', { recipes: _recipes });
            }
          });
        }
        else{
          res.render('menu', {
            error: err,
            message: "Bummer, looks like we are having some technical difficulties. Check back soon to see what's next!"
          });
        }
      });
    }
    else{
      res.render('menu', { message: "Bummer, doesn't look like we have anything on tap at the moment. Check back soon to see what's next!" });
    }
  }
  catch(e){
    console.log(e);
    response["error"] = e;
    res.render('menu', response);
  }
});

/* GET menu page. */
router.get('/brewing', function(req, res) {
  res.render('brewing');
});

/* GET menu page. */
router.get('/projects', function(req, res) {
  res.render('projects');
});

router.get('/api', function(req, res){
  res.render('api');
});

router.post('/api/keg', function(req, res){
  try{
    if(req.pool){
      req.pool.connect();
    }
    res.render({ "Success": e });
  }
  catch(e){
    res.render({ "Error": e });
  }
});

/* 
  Catch all to route anything that doesn't 
  match back to the home page. 
*/
router.get('/*', function(req, res) {
  res.redirect('/');
});

module.exports = router;
