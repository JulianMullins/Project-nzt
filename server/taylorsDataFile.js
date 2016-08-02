var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Stats=require('../models/Stats')
var Leaderboards=require('../models/Leaderboard')
var Highscores=require('../models/HighScore')

var tempGame = null;

router.get('/taco',function(req, res, next){
   //return res.json({stats: req.user.stats})
   //console.log(req.user, 'taylor')
  Highscores.find({user: req.user.stats}, function(err,stats){
    if(err){
      console.log(err)
    }
    else{
      res.json({stats: stats})
    }
  })
});


  module.exports=router;