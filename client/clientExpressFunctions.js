var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');

var tempGame = null;

router.post('/startGame/:mode/:nLevel',function(req,res,next){
  var user = null;
  var tempUser = null;
  if(req.user){
    user=req.user._id;
  }
  else{
    tempUser = "Anonymous"
  }
  tempGame = new Game({
    user:user,
    tempUser:tempUser,
    mode:req.params.mode,
    score:0,
    nLevel:req.params.nLevel
  })
  tempGame.save(function(err,game){
    if(err){
      res.send(err);
    }
    else{
      res.json({gameId: game._id})
    }
  })
})
