var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');

var tempGame = null;


//TAYLOR'S STATS FUNCTIONS

router.get('/getstats',function(req, res, user){
  console.log(req.user.stats,'170')
  Stats.findById(req.user.stats, function(err,stats){
    if(err){
      console.log(err)
    }
    else{
      res.json({stats: stats})
    }
  });
});


router.get('/taco',function(req, res, next){

 //return res.json({stats: [123]})
  console.log("lolololololololol")
  // console.log(req.user.stats,'170')
  Stats.find({_id: "5797cc284b2cd3540fe8b9b9"}, function(err,stats){
    if(err){
      console.log(err)
    }
    else{
      console.log('found')
      res.json({stats: [123]})
    }
  })
});


  module.exports=router;