var express = require('express');
var router = express.Router();
var axios = require('axios');


var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');
var Stats = require('../models/Stats');

var serverData = require('./serverData');

var modeMultiplier = serverData.modeMultiplier;
var penalty = serverData.penalty;
var positivePoints = serverData.positivePoints;
var scoresToPass = serverData.scoresToPass;

var tempGame = null;



//post start game
router.post('/startGame/:mode/:nLevel',function(req,res,next){
  console.log("trying to post game");
  console.log(req.session.user);
  //if user, create game, save game, add to user.currentGame
  if(req.session.user){
    User.findById(req.session.user._id).exec(function(err,user){
      if(err||!user){
        res.json({success:false});
      }
      else{
        if(user.maxN[req.params.mode]<req.params.nLevel){
          res.json({authorized:false})
          return;
        }
        var tempGame = new Game({
          gameUser:user._id,
          mode:req.params.mode,
          baseScore:0,
          nLevel:req.params.nLevel,
          tempUser:user.temp
        })
        tempGame.save(function(err,game){
          if(err){
            console.log(err);
          }
          else{
            user.currentGame.unshift(game);
            user.save(function(err,user){
              if(err){
                res.json({success:false});
              }
              else{
                console.log(req.session.user, user, "game posted")
                res.json({
                  authorized:true,
                  gameId: game._id,
                  tempUser: false,
                  modeMultiplier: modeMultiplier[tempGame.mode],
                  penalty: penalty,
                  positivePoints: positivePoints
                })
              }
            });
            
          }
        })
      }

    })
  }
  else{
    //if no user, make tempUser then do above (create game, add to tempUser, etc.)
    
    
    console.log("no user")
    var tempUser = new User({
      username:'Anonymous',
      stats:null,
      currentGame:[],
      maxN:{
          classic:1,
          relaxed:1,
          silent:1,
          advanced:1
        },
      temp:true,
      leaderboard:null,
      email:null
    })

    var leaderboard = new Leaderboard({user:tempUser.username});
    console.log("leaderboard created");
    var userStats = new Stats({statsUser:tempUser._id,leaderboard:leaderboard._id});
    console.log("stats created")
    userStats.save(function(err,stats){console.log("stats saved, err:",err)});
    leaderboard.leaderboardBelongsToStats = userStats._id;
    leaderboard.save(function(err,leaderboard){console.log("leaderboard saved, err:",err)});
    tempUser.stats = userStats._id;


    console.log("saving tempUser")
    tempUser.save(function(err,user){
      if(err){
        console.log(err);
        return;
      }
      else if(!user){
        console.log("no user")
        return
      }
      console.log("tempuser saved: "+user)

      req.session.user = user;
      req.session.user.save();
      req.fullUser = false;


      //create game
      console.log("creating game for " + user);
      var tempGame = new Game({
        gameUser:user._id,
        mode:req.params.mode,
        baseScore:0,
        nLevel:req.params.nLevel,
        tempUser:user.temp
      })
      console.log("tempGame made");
      tempGame.save(function(err,game){
        if(err){
          console.log(err);
        }
        else{
          console.log("tempGame saved");
          user.currentGame.unshift(game._id);
          user.save(function(err,user){
            console.log(user, "\ngame posted")
            res.json({
              authorized:true,
              gameId: game._id,
              tempUser: user.temp,
              modeMultiplier: modeMultiplier[tempGame.mode],
              penalty: penalty,
              positivePoints: positivePoints,
              isHighScore:null
            })
          });

        }
      })

      req.session.user.save();

      //createGame(req,res,user.temp)
    
  }.bind(this))

}


});



//game end - posted from mode files; find game, update game stats
router.post('/gameEnd',function(req,res,next){
  //console.log("game ended")
  //console.log(req.body)
  Game.findById(req.body.gameId,function(err,game){
    if(err){
      console.log(err);
    }
    else if(!game) {
      console.log("no game")
    }
    else{
      console.log(req.body)
      game.baseScore = req.body.score;
      game.fullScore = req.body.score*modeMultiplier[game.mode]*game.nLevel;
      game.passedLevel = false;
      //console.log(game)
      //console.log(scoresToPass)
      //console.log(scoresToPass[game.mode][game.nLevel])
      //console.log(game.baseScore, game.fullScore);
      //console.log(game.fullScore>= scoresToPass[game.mode][game.nLevel]);
      if(game.fullScore>= scoresToPass[game.mode][game.nLevel]){
        game.passedLevel=true;
        //console.log("Passed level in /gameEnd: ", game.passedLevel)
      }

      game.reactionTimes=req.body.reactionTimes;
      game.accuracy=req.body.accuracy;
      console.log("Game in gameEnd call: "+game)
      //console.log(game.passedLevel)
      game.save(function(err,game){
        if(err){
          res.json({success:false})
        }
        else{
          console.log("game ended successfully",game)
          res.json({
            success:true,
            score:game.baseScore,
            passedLevel:game.passedLevel,
            gameId:game._id,
            accuracy:game.accuracy
          })

          // post to gameOver
          // axios.post('/api/gameOver',{
          //   userId: req.body.userId
          // })

        }
      });
    }
  })
})


module.exports= router;
