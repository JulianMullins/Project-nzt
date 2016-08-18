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


//reset session on app load if !fullUser
router.get('/getUserOnLoad',function(req,res,next){
  if(req.session.user && req.session.user.temp){
    console.log(req.session.user.temp)
    req.session.destroy();
  }
  else if(req.session.user && !req.session.user.temp){
    User.findById(req.session.user._id,function(err,user){
      user.currentGame = [];
      user.save(function(err,user){
        if(!err && user){
          res.json({success:true})
        }
        else{
          res.json({success:false})
        }
      })
    })
  }
})


//get User info for home page
router.get('/homeUserInfo',function(req,res,next){
  if(req.session.user){
    console.log("show tutorial: "+req.session.user.showTutorial)
    res.json({
      name:req.session.user.name,
      hasUsername: !req.session.user.temp,
      showTutorial: req.session.user.showTutorial
    })
  }
  else{
    res.json({
      name:null,
      hasUsername:false,
      showTutorial:false
    })
  }
})


//change user setting to not show overlay
router.post('/stopShowOverlay',function(req,res,next){
  console.log('/stopShowOverlay begun')  

  User.findById(req.session.user._id,function(err,user){
    if(err){
      res.json({success:false})
    }
    else{
      user.showTutorial=false;
      user.save(function(err,user){
        if(err){
          res.json({success:false,error:err})
        }
        else{
          req.session.user = user;
          res.json({success:true,error:null})
        }
      })
    }
  })

})


//check if user at all, check if tempuser/full user  
    // navBar, relaxedMode
    //(sort of in client/index.js, but commented out)
router.get('/isUser',function(req,res,next){
  if(req.session.user){
    console.log("is user: ", !req.session.user.temp)
    res.json({isloggedin:true, isUser:!req.session.user.temp})
  }
  else{
    res.json({isUser:false,isloggedin:false})
  }
  return;
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
      nLevel:game.nLevel,
      game:game
    })
  })
})

//get various user data (gameOver, Mainmenu)
router.get('/getUser',function(req,res,next){
  var games = null;
  var isUser = false;
  var username=null;
  var name=null;

  if(!req.session.user){
    res.json({
      isAnon: null,
      alreadyLoggedIn: false,
      isUser: false,
      username:null,
      name:null
    })
  }
  else{
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
      isAnon: req.session.user.temp,
      alreadyLoggedIn: !req.session.user.temp,
      isUser: isUser,
      username:username,
      name:name
    })
  }
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

      if(game.fullScore >= scoreToPass) {
        passedLevel = true;
      } else {
        passedLevel = false;
      }

      res.json({
        modeMultiplier:modeMultiplier[game.mode],
        game:game,
        success:true,
        scoreToPass: scoreToPass,
        passedLevel: passedLevel,
        accuracy: game.accuracy
      })
    }
  })
})

router.get('/getScore',function(req,res){
  Game.findById(req.session.user.currentGame[0],function(err,game){
    if(game){
      res.json({
        baseScore:game.baseScore,
        fullScore:game.fullScore
      });
    }
    else{
      res.json({error:true})
    }
  })
})



module.exports=router;
