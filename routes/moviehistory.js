var express = require('express');
var router = express.Router();
var app = express();
var http = require('http').Server(app);
var data = require('../data/history.json');

router.get('/', function(req, res) {
  res.render('moviehistory', data);
});

module.exports = router;
