var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');

var tempGame = null;

router.get('/isLoggedIn',function(req,res,next){
  res.json({'loggedIn': !!req.user})
})

router.post('/startGame/:mode/:nLevel',function(req,res,next){
  tempGame = new Game({
    user:req.user,
    mode:req.params.mode,
    score:0,
    nLevel:req.params.nLevel,
    tempUser:req.user.temp
  })
  tempGame.save(function(err,game){
    if(err){
      res.send(err);
    }
    else{
      res.json({gameId: game._id,tempUser:tempUser})
    }
  })
})




module.exports=router;
