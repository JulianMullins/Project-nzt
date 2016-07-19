var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/tutorial',function(req,res,next){
  res.render('tutorial')
})

router.get('/settings',function(req,res,next){
  res.render('settings')
})

router.post('/settings',function(req,res,next){

})

router.get('/game',function(req,res,next){
  res.render('gameView')
})

module.exports = router;
