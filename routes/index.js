var express = require('express');
var jade = require('jade');
var router = express.Router();

// There is middleware implemented in `server.js` that binds the db instance
// to the `req` object before any of these routes are hit.

/* GET home page. */
router.get('/', function(req, res) {
  var response = {};
  try{
    if(req.db){
      req.db.connect();
      response.hiddenMessage = "db enabled";
      req.db.end();
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
    // For now, we'll use these hard-coded mock objects.
    var _recipes = [
      {
        keg: 2,
        name: "Citra Pale Ale",
        srm: 9,
        ibu: 52,
        abv: 5.2,
        grains: ["Pale 2-Row", "Canadian Honey Malt", "American Munich 10L"],
        hops: ["Centenniel", "Citra (Hop-Burst & Dry-Hop)"],
        yeast: "Safale - American Ale Yeast US-05"
      },
      {
        keg: 1,
        name: "Honey Blonde Ale",
        srm: 7,
        ibu: 24,
        abv: 4.8,
        grains: ["Pale 2-Row", "Canadian Honey Malt"],
        hops: ["Cascade", "Citra"],
        yeast: "Wyeast - California Lager 2112"
      },
    ];

    for(var i = 0, len = _recipes.length; i < len; i++){
      response.recipes.push(jade.renderFile('./views/_recipe.jade', { recipe: _recipes[i] }));
    }

    // TODO: Setup db to retrieve recipes for active taps
    if(req.db){
      req.db.connect();
      response["hiddenMessage"] = "db connected";
      req.db.end();
    }
  }
  catch(e){
    response["Error"] = e;
  }
  console.log(response);
  res.render('menu', response);
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
    if(req.db){
      req.db.connect();
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
