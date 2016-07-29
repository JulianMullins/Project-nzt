var express = require('express');
var router = express.Router();
var axios = require('axios');


var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');
var Stats = require('../models/Stats');
var TempUser = require('../models/TempUser');

var serverData = require('./serverData');

var modeMultiplier = serverData.modeMultiplier;
var penalty = serverData.penalty;
var positivePoints = serverData.positivePoints;
var scoresToPass = serverData.scoresToPass;

var tempGame = null;



//post start game
router.post('/startGame/:mode/:nLevel',function(req,res,next){
  console.log("trying to post game");
  //console.log(req.user);

  //if user, create game, save game, add to user.currentGame
  if(req.user){
    //console.log(req.user);
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
          positivePoints: positivePoints,
          userId:null
        })
      }
    })
  }
  else{
    //if no user, make tempUser,login tempUser, then do above (create game, add to tempUser, etc.)
    console.log("no req.user")
    var tempUser = new TempUser({
        username:null,
        stats:null,
        currentGame:[],
        maxN:{
            classic:1,
            relaxed:1,
            silent:1,
            advanced:1
          },
        temp:true
      })

      var leaderboard = new Leaderboard({user:tempUser._id});
      leaderboard.save();
      var userStats = new Stats({user:tempUser._id,leaderboard:leaderboard._id});
      userStats.save();
      tempUser.stats = userStats._id;

      console.log("saving tempUser")
      tempUser.save(function(err,user){
        if(err){
          console.log(err);
          return;
        }
        console.log(user)

        //login tempUser
        axios.post('/login', {
          username: user._id,
          password: 'password'
        }).then(function(response){
          console.log(response.data)
          if(response.data.success){
            console.log("tempuser created")
            console.log(req.user)

            req.user = response.data.user;
            console.log(req.user);

            // axios.get('/isUser')
            // .then(function(response){
            //   console.log(req.user)
            //   console.log("isuser data: ")
            //   console.log(response.data)



            //   res.json({
            //         gameId: '12431432543',
            //         tempUser: user.temp,
            //         modeMultiplier: modeMultiplier,
            //         penalty: penalty,
            //         positivePoints: positivePoints
            //       })
            // console.log("res.json'ed")


            // })


            //create game
            console.log("creating game for " + user);
            var tempGame = new Game({
              user:user._id,
              mode:req.params.mode,
              score:0,
              nLevel:req.params.nLevel,
              tempUser:user.temp
            })
            console.log("tempGame saved");
            tempGame.save(function(err,game){
              if(err){
                console.log(err);
              }
              else{
                user.currentGame.unshift(game._id);
                user.save(function(err,user){
                  console.log(user, "game posted")
                  res.json({
                    gameId: game._id,
                    tempUser: user.temp,
                    modeMultiplier: modeMultiplier,
                    penalty: penalty,
                    positivePoints: positivePoints,
                    userId: user._id
                  })
                });
                
              }
            })



            //createGame(req,res,user.temp)    
          }
        }.bind(this))

      })
    }
    
   //console.log(req.user); 
});

// var createGame = function(req,res,userTemp){
//     console.log("creating game for " + user);
//     var tempGame = new Game({
//       user:req.user,
//       mode:req.params.mode,
//       score:0,
//       nLevel:req.params.nLevel,
//       tempUser:req.user.temp
//     })
//     tempGame.save(function(err,game){
//       if(err){
//         console.log(err);
//       }
//       else{
//         req.user.currentGame.unshift(game._id);
//         req.user.save();
//         console.log(req.user, "game posted")
//         res.json({
//           gameId: game._id,
//           tempUser: userTemp,
//           modeMultiplier: modeMultiplier,
//           penalty: penalty,
//           positivePoints: positivePoints
//         })
//       }
//     })
// }


//game end - posted from mode files; find game, update game stats
router.post('/gameEnd',function(req,res,next){
  console.log("game ended")
  //console.log(req.user)
  console.log(req.body)
  Game.findById(req.body.gameId,function(err,game){
    if(err){
      console.log(err);
    }
    else if(!game) {
      console.log("no game")
    }
    else{
      game.score = req.body.score;

      game.passedLevel = false;
      console.log(game)
      //console.log(scoresToPass)
      console.log(scoresToPass[game.mode][game.nLevel])
      console.log(game.score);
      console.log(game.score>= scoresToPass[game.mode][game.nLevel]);
      if(game.score>= scoresToPass[game.mode][game.nLevel]){
        game.passedLevel=true;
        console.log("If statement passed level: ", game.passedLevel)
      }
      
      game.reactionTimes=req.body.reactionTimes;
      console.log(game.passedLevel)
      game.save(function(err,game){
        if(err){
          res.json({success:false})
        }
        else{
          console.log("game ended successfully",game)
          res.json({
            success:true,
            score:game.score,
            userId:req.body.userId,
            passedLevel:game.passedLevel,
            gameId:game._id
          })

          //post to gameOver
          axios.post('/gameOver',{
            userId: req.body.userId
          })

        }
      });
    }
  })
})


module.exports= router;