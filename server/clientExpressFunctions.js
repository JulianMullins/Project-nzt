var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');

var tempGame = null;

router.get('/isLoggedIn',function(req,res,next){
  var isloggedin = false;
  console.log(req.user)
  if(req.user && !req.user.temp){
    isloggedin = true;
  }
  console.log("logged in: "+isloggedin)
  res.json({
    'loggedIn': isloggedin
    // 'username': req.user.username
  })
});

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
      req.user.currentGame = game;
      res.json({'gameId': game._id,'tempUser':tempUser})
    }
  })
})

router.get('/getMaxN',function(req,res,next){
  res.json({maxN:req.user.maxN})
})

router.get('/getUser',function(req,res,next){
  res.json({username:req.user.username})
})

router.get('/getScore',function(req,res,next){
  Game.findById(req.user.currentGame,function(err,game){
    if(err){
      console.log(err)
    }
    else{
      res.json({'score':game.score})
    }
  })
})

router.post('/gameEnd',function(req,res,next){
  Game.findById(req.body.gameId,function(err,game){
    if(err){
      console.log(err);
    }
    else if(!game) {
      console.log("no game")
    }
    else{
      game.setState({
        score:gameScore,
        reactionTimes:reactionTimes
      })
      res.json({success:true})
    }
  })
})


module.exports=router;
