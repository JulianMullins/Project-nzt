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


  
router.get('/isUser',function(req,res,next){
  console.log(req.user)
  if(req.user){
    res.json({isloggedin:true,isUser:req.user.temp})
  }
  else{
    res.json({isUser:false,isloggedin:false})
  }
  
});

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


router.get("/getGameData",function(req,res,next){
  Game.findById(req.user.currentGame[0],function(err,game){
    res.json({
      score:game.score,
      mode:game.mode,
      nLevel:game.nLevel
    })
  })
})

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


router.get('/getGame',function(req,res,next){
  console.log(req.user)
  Game.findById(req.user.currentGame[0],function(err,game){
    if(err){
      console.log(err)
      res.json({success:false})
    }
    else{
      console.log(game)
      res.json({game:game,success:true})
    }
  })
})


router.get('/taco',function(req, res, next){
 //return res.json({stats: [123]})
  //console.log("lolololololololol")
   console.log(req.user.stats,'170')
  Stats.findById(req.user.stats, function(err,stats){
    if(err){
      console.log(err)
    }
    else{
      res.json({stats: req.user.stats})
    }
  })
})


module.exports=router;
