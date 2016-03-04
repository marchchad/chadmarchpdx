// Import required libraries
var express = require('express');
var jade = require('jade');
var utils = _rootRequire('utils/helpers');

// Get instance of router
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var response = {};
  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          response.hiddenMessage = 'pool enabled';
          conn.release();
        }
      });
    }
  }
  catch(e){
    response['Error'] = e;
  }
  res.render('index', response);
});

/* GET menu page. */
// TODO:
//   May want to implement ORM to abstract the error
//   and data logic away from router
router.get('/ontap', function (req, res) {
  var response = {};
  try{
    if(req.pool){
      req.pool.getConnection(function(err, conn){
        if(conn){
          conn.query('call get_recipes', function(err, results){
            conn.release();
            if(err && err.errno > 0){
              res.render('menu', {
                error: err,
                message: 'Bummer, looks like we are having some technical difficulties. Check back soon to see what\'s next!'
              });
            }
            else{
              results = results[0];
              var _recipes = [];
              
              var data = [];

              for(var i = 0, len = results.length; i < len; i++){
                if(results[i].hasOwnProperty('Name')){

                  var recipe = {
                    target: 'keg' + results[i].keg,
                    grains: [],
                    hops: []
                  };

                  var grains = results[i].grains.split('|');
                  var grainTotal = 0;
                  for(var j = 0, jlen = grains.length; j < jlen; j++){
                    var grain = grains[j].split(',');
                    recipe.grains.push({
                      name: grain[0],
                      color: grain[1],
                      colorType: grain[2],
                      lbs: grain[3]
                    });
                    grainTotal += grain[3];
                  }

                  var hops = results[i].hops.split('|');
                  for(var j = 0, jlen = hops.length; j < jlen; j++){
                    var hop = hops[j].split(',');
                    recipe.hops.push({
                      name: hop[0],
                      oz: hop[1],
                      time: hop[2]
                    });
                  }

                  data.push(recipe);
                  
                  _recipes.push(jade.renderFile('./views/shared/_recipe.jade', { recipe: results[i] }));
                }
              }

              var response = {
                recipes: _recipes,
                data: data
              };

              res.render('menu', response);
            }
          });
        }
        else{
          res.render('menu', {
            'error': err,
            message: 'Bummer, looks like we are having some technical difficulties. Check back soon to see what\'s next!'
          });
        }
      });
    }
    else{
      res.render('menu', { message: 'Bummer, doesn\'t look like we have anything on tap at the moment. Check back soon to see what\'s next!' });
    }
  }
  catch(e){
    console.log({'Error': e});
    response['error'] = e;
    res.render('menu', response);
  }
});

router.get('/ontap/keg/:id', function (req, res) {
  var response = {};
  try {
    if (req.pool) {
      req.pool.getConnection(function (err, conn) {
        if (conn) {
          conn.query('call get_keg_info(?)', req.params.id, function (err, results) {
            conn.release();
            if (err && err.errno > 0) {
              throw 'There was an error querying the keg information. Please try again later.';
            }
            else {
              // Render response to keg info template
              var keginfo = results[0][0];
              keginfo.keggedon = utils.getDateParts(keginfo.keggedon);
              if (keginfo.lastpour){
                keginfo.lastpour = utils.dateDiff(new Date(), new Date(keginfo.lastpour));
              }
              keginfo.remainingvolume = parseFloat(keginfo.remainingvolume);
              var response = {
                'keginfo': keginfo
              };
              res.render('shared/_keginfo', response);
            }
          });
        }
        else {
          throw 'No connection available. Please try again later.';
        }
      });
    }
    else {
      throw 'No connection pool available. Please try again later.';
    }    
  }
  catch (e) {
    console.log({'Error': e});
    response['error'] = e;
    res.render('./views/shared/_keginfo', response);
  }
})

/* GET menu page. */
router.get('/brewing', function(req, res) {
  res.render('brewing');
});

/* GET menu page. */
router.get('/projects', function(req, res) {
  res.render('projects');
});

/* GET API page. */
router.get('/', function(req, res){
  res.render('api');
});

module.exports = router;