var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Movie Vis', version: '1.0' });
});

router.get('/movieinfo', function(req, res, next) {
  res.render('movieinfo', { title: 'Movie Vis', version: '1.0' });
});

module.exports = router;
