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


router.post('/startGame/:mode/:nLevel',function(req,res,next){
  console.log("trying to post game");
  // if(!req.user){
  //     var tempUserStats = new Stats();
  //     tempUserStats.save();
  //     var tempUser = new User({
  //       username:null,
  //       stats:tempUserStats._id,
  //       temp:true,
  //       currentGame:[],
  //       maxN:{
  //           classic:1,
  //           relaxed:1,
  //           silent:1,
  //           advanced:1
  //         }
  //     })
  //     tempUser.save(function(err,user){
  //       if(err){
  //         console.log(err);
  //       }
  //     })

  //     fetch('/login',{
  //       method:'POST',
  //       credentials: 'include',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         username:null,
  //         password:{
  //           password:null,
  //           user: tempUser._id
  //         }
  //       })
  //     }).then(function(response) {
  //       return response.json();
  //     }).then(function(response) {
  //       if (response.success) {
          
  //         tempGame = new Game({
  //           user:req.user,
  //           mode:req.params.mode,
  //           score:0,
  //           nLevel:req.params.nLevel,
  //           tempUser:req.user.temp
  //         })
  //         tempGame.save(function(err,game){
  //           if(err){
  //             console.log(err);
  //           }
  //           else{
  //             req.user.currentGame.unshift(game);
  //             res.json({gameId: game._id,tempUser:tempUser})
  //           }
  //         })

  //       }
  //     }.bind(this))

  //   }
    // else{
      console.log(req.user);
    var tempGame = new Game({
        user:req.user,
        mode:req.params.mode,
        score:0,
        nLevel:req.params.nLevel,
        tempUser:req.user.temp
      })
      tempGame.save(function(err,game){
        if(err){
          console.log(err);
        }
        else{
          req.user.currentGame.unshift(game);
          req.user.save();
          console.log(req.user, "game posted")
          res.json({
            gameId: game._id,
            tempUser: false,
            modeMultiplier: modeMultiplier,
            penalty: penalty,
            positivePoints: positivePoints
          })
        }
      })
    // }
});

  
router.get('/isUser',function(req,res,next){
  console.log(req.user)
  if(req.user){
    res.json({isUser:true,isloggedin:req.user.temp})
  }
  else{
    res.json({isUser:false})
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
  if(req.user && req.user.currentGame){
    games = req.user.currentGame
    isUser=true
    username=req.user.username,
    name=req.user.name
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

router.post('/gameEnd',function(req,res,next){
  console.log("game ended")
  console.log(req.user)
  console.log(req.body)
  Game.findById(req.user.currentGame[0],function(err,game){
    if(err){
      console.log(err);
    }
    else if(!game) {
      console.log("no game")
    }
    else{
      game.score = req.body.score;
      game.reactionTimes=req.body.reactionTimes;
      game.save();
      console.log("game ended successfully",game)
      res.json({success:true,score:req.body.score})
    }
  })
})

router.get('/taco',function(req, res, next){

 return res.json({stats: [123]})
  console.log("lolololololololol")
  // console.log(req.user.stats,'170')
  Stats.findById(req.user.stats, function(err,stats){
    if(err){
      console.log(err)
    }
    else{
      res.json({stats: [123]})
    }
  })
})


module.exports=router;
