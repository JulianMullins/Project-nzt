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



router.get('/getUserOnLoad',function(req,res,next){
  if(req.session.user && req.session.user.temp){
    req.session.destroy();
  }
  res.json({success:true})
})


//check if user at all, check if tempuser/full user  
    // navBar, relaxedMode
    //(sort of in client/index.js, but commented out)
router.get('/isUser',function(req,res,next){
  if(req.session.user){
    res.json({isloggedin:true,isUser:req.session.user.temp})
  }
  else{
    res.json({isUser:false,isloggedin:false})
  }
  
});


//check if logged in ---- not in use
router.get('/isLoggedIn',function(req,res,next){
  var isloggedin = false;
  if(req.session.user && !req.session.user.temp){
    isloggedin = true;
  }
  console.log("logged in: "+isloggedin)
  res.json({
    'loggedIn': isloggedin
    // 'username': req.session.user.username
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
            //console.log(req.session.user)
  if(req.session.user){
    maxN= req.session.user.maxN
  }
  res.json({maxN:maxN})
})

//get data for game (not in use)
router.get("/getGameData",function(req,res,next){
  Game.findById(req.session.user.currentGame[0],function(err,game){
    res.json({
      score:game.score,
      mode:game.mode,
      nLevel:game.nLevel
    })
  })
})

//get various user data (gameOver, Mainmenu)
router.get('/getUser',function(req,res,next){
  var games = null;
  var isUser = false;
  var username=null;
  var name=null;
  if(req.session.user && !req.session.user.temp){
    isUser=true
    username=req.session.user.username,
    name=req.session.user.name
  }
  if(req.session.user && req.session.user.currentGame){
    games = req.session.user.currentGame
  }
  if(req.session.user){
    console.log("here are stats from /getUser:")
    Stats.findById(req.session.user.stats,function(err,stats){
      console.log(stats);
      console.log(req.session.user);
    })
  }
  
  res.json({
    alreadyLoggedIn: !req.session.user.temp,
    isUser: isUser,
    username:username,
    name:name
  })
})

//get game data at end of game (gameOver)
router.get('/getGame',function(req,res,next){
  var allScoresToPass = serverData.scoresToPass;
  var scoreToPass;
  var passedLevel;

  Game.findById(req.session.user.currentGame[0],function(err,game){
    if(err){
      console.log(err)
      res.json({success:false})
    }
    else{
      console.log("game: ", game);
      scoreToPass = allScoresToPass[game.mode][game.nLevel];

      if(game.score >= scoreToPass) {
        passedLevel = true;
      } else {
        passedLevel = false;
      }

      res.json({
        modeMultiplier:modeMultiplier[game.mode],
        game:game,
        success:true,
        scoreToPass: scoreToPass,
        passedLevel: passedLevel
      })
    }
  })
})

router.get('/getScore',function(req,res){
  Game.findById(req.session.user.currentGame[0],function(err,game){
    if(game){
      res.json({score:game.score});
    }
  })
})



module.exports=router;
