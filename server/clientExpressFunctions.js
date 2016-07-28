var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');
var serverData = require('./serverData');

var modeMultiplier = serverData.modeMultiplier;
var penalty = serverData.penalty;
var positivePoints = serverData.positivePoints;

var Stats = require('../models/Stats')

var tempGame = null;


//check if user at all, check if tempuser/full user  
    // navBar, relaxedMode
    //(sort of in client/index.js, but commented out)
router.get('/isUser',function(req,res,next){
  console.log(req.user)
  if(req.user){
    res.json({isloggedin:true,isUser:req.user.temp})
  }
  else{
    res.json({isUser:false,isloggedin:false})
  }
  
});


//check if logged in ---- not in use
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

//get max N (default 1) for level display
router.get('/getMaxN',function(req,res,next){
  var maxN={
              classic:1,
              relaxed:1,
              silent:1,
              advanced:1
            };
            //console.log(req.user)
  if(req.user){
    maxN= req.user.maxN
  }
  res.json({maxN:maxN})
})

//get data for game (not in use)
router.get("/getGameData",function(req,res,next){
  Game.findById(req.user.currentGame[0],function(err,game){
    res.json({
      score:game.score,
      mode:game.mode,
      nLevel:game.nLevel,
      passedLevel: game.passedLevel
    })
  })
})

//get various user data (gameOver, Mainmenu)
router.get('/getUser',function(req,res,next){
  var games = null;
  var isUser = false;
  var username=null;
  var name=null;
  if(req.user && !req.user.temp){
    isUser=true
    username=req.user.username,
    name=req.user.name
  }
  if(req.user && req.user.currentGame){
    games = req.user.currentGame
  }
  res.json({
    alreadyLoggedIn: !!req.user,
    isUser: isUser,
    username:username,
    name:name
  })
})

//get game data at end of game (gameOver)
router.get('/getGame',function(req,res,next){
  console.log(req.user)
  Game.findById(req.user.currentGame[0],function(err,game){
    if(err){
      console.log(err)
      res.json({success:false})
    }
    else{
      console.log(game)
      res.json({
        game:game,
        success:true
      })
    }
  })
})





module.exports=router;
