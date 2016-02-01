var express = require('express');
var router = express.Router();

/* GET frame JSON files */
router.get('/data/:movie', function(req, res, next) {
  var frames = require('/data/' + req.params.movie + '/frames.json');
  res.json(frames);
});

module.exports = router;
