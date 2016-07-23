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
  console.log(req.user)
  if(!req.user){
      var tempUserStats = new Stats();
      tempUserStats.save();
      var tempUser = new User({
        username:null,
        stats:tempUserStats._id,
        temp:true,
        currentGame:[],
        maxN:{
            classic:1,
            relaxed:1,
            silent:1,
            advanced:1
          }
      })
      tempUser.save(function(err,user){
        if(err){
          res.send(err)
        }
      })

      fetch('/login',{
        method:'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username:null,
          password:{
            password:null,
            user: tempUser._id
          }
        })
      }).then(function(response) {
        return response.json();
      }).then(function(response) {
        if (response.success) {
          
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
              req.user.currentGame.unshift(game);
              res.json({gameId: game._id,tempUser:tempUser})
            }
          })

        }
      }.bind(this))
  
    }
    else{
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
          req.user.currentGame.unshift(game);
          res.json({gameId: game._id,tempUser:tempUser})
        }
      })
    }
});

  //anon user
router.get('/startAnon',function(req,res,next){
  
  
})


router.get('/getMaxN',function(req,res,next){
  var maxN={
              classic:1,
              relaxed:1,
              silent:1,
              advanced:1
            };
            console.log(req.user)
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
  console.log("gonna check for games")
  if(req.user && req.user.currentGame){
    games = req.user.currentGame
  }
  console.log("gonna res.json now")
  res.json({
    username:req.user.username,
    games:games
  })
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
      game.score = req.body.score;
      game.reactionTimes=req.body.reactionTimes;
      res.json({success:true})
    }
  })
})


module.exports=router;
