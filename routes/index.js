var express = require('express');
var jade = require('jade');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Chad\'s Node App'});
});

/* GET menu page. */
router.get('/about', function(req, res, next) {
  res.render('about');
});

/* GET menu page. */
router.get('/ontap', function(req, res, next) {
  // TODO: Setup db to retrieve recipes for active taps
  // For now, we'll use these hard-coded mock objects.
  var recipes = [
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

  var _recipes = [];

  for(var i = 0, len = recipes.length; i < len; i++){
    _recipes.push(jade.renderFile('./views/_recipe.jade', { recipe: recipes[i] }));
  }

  res.render('menu', { recipes: _recipes } );
});

/* GET menu page. */
router.get('/brewing', function(req, res, next) {
  res.render('brewing');
});

/* GET menu page. */
router.get('/projects', function(req, res, next) {
  res.render('projects');
});


/* 
  Catch all to route anything that doesn't 
  match back to the home page. 
*/
router.get('/*', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;
