var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/tutorial',function(req,res,next){
  res.render('tutorial')
})

module.exports = router;
