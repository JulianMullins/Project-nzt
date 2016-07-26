var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');
var Stats = require('../models/Stats')

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
          console.log(err);
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
              console.log(err);
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
          console.log(err);
        }
        else{
          req.user.currentGame.unshift(game);
          res.json({gameId: game._id,tempUser:tempUser})
        }
      })
    }
});

  
router.get('/isUser',function(req,res,next){
  console.log(req.user)
  if(req.user){
    res.json({isUser:true})
  }
  else{
    res.json({isUser:false})
  }
  
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
  // Game.findById(req.body.gameId,function(err,game){
  //   if(err){
  //     console.log(err);
  //   }
  //   else if(!game) {
  //     console.log("no game")
  //   }
  //   else{
  //     game.score = req.body.score;
  //     game.reactionTimes=req.body.reactionTimes;
  //     res.json({success:true})
  //   }
  // })
  res.json({score:req.body.score})
})

router.get('/getstats',function(req, res, user){
  console.log(req.user.stats,'170')
  Stats.findById(req.user.stats, function(err,stats){
    if(err){
      console.log(err)
    }
    else{
      res.json({stats: stats})
    }
  })
//  .populate()
  // .exec(function(err, stats){
  //   if(err){
  //     console.log(err)
  //   }
  //   else{
  //     console.log('176')
  //     res.json({stats: stats})
  //   }
  // })
})

module.exports=router;
