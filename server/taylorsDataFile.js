var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Stats=require('../models/Stats')
var Leaderboards=require('../models/Leaderboard')
var Highscores=require('../models/HighScore')

var tempGame = null;

router.get('/taco',function(req, res, next){

 //return res.json({stats: [123]})
  console.log("lolololololololol")
  console.log(req.user)
console.log(req.user.stats,'170')
   //return res.json({stats: req.user.stats})
  Highscores.find({user: '579a80e63a9316c80c2a6c30'}, function(err,stats){
    if(err){
      console.log(err)
    }
    else{
      console.log('foud')
      res.json({stats: stats})
    }
  })
});


  module.exports=router;