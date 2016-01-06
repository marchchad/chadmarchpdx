var express = require('express');
var router = express.Router();

// This routes to the http[s]://{site.com}/admin/ homepage
// not http[s]://{site.com}/
router.get('/', function(req, res){
  res.render('admin');
});

module.exports = router;