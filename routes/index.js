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

  var response = {
    recipes: []
  };

  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        conn.query('call get_recipes', function(err, results){
          conn.release();
          results = results[0];
          for(var i = 0, len = results.length; i < len; i++){
            if(results[i].hasOwnProperty("Name")){
              results[i]["grains"] = results[i].grains.split(",");
              results[i]["hops"] = results[i].hops.split(",");
              
              response.recipes.push(jade.renderFile('./views/_recipe.jade', { recipe: results[i] }));
            }
          }
          res.render('menu', response);
        });
      });
    }
  }
  catch(e){
    console.log(e)
    response["Error"] = e;
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
