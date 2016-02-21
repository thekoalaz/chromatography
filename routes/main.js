//var data = require('../data.json');
var express = require('express');
var router = express.Router();
var app = express();
var http = require('http').Server(app);

router.get('/', function(req, res) {
  res.render('main', { title: 'Chefbox', version: '0.0.1' });
});

router.get('/main', function(req, res) {
  res.render('main', { title: 'Chefbox', version: '0.0.1' });
});

module.exports = router;
