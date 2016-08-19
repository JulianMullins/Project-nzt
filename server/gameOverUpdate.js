var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var OverallLeaderboard = require('../models/OverallLeaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');
var Stats = require('../models/Stats');
var ErrorModel = require('../models/Error');

var serverData = require('./serverData');

var serverLeaderboard = serverData.serverLeaderboard;
var leaderboardSize = serverData.leaderboardSize;
var modeMultiplier = serverData.modeMultiplier;

var isLiveMode = true;
if(process.env.url == 'http://localhost:3000'){
  isLiveMode = false;
}

//functions for save game

var validateScore = function(score,callback){
  score.reactionTimes.filter(function(element){
      if(element<0){
        var newError = new ErrorModel({
          type: 'reactionTimes',
          message: 'negative reaction time',
          isLiveMode: isLiveMode,
          time: Date.now()
        })
        newError.save();
      }
      return element>=0;
  })

  if(!score.userName){
    var newError = new ErrorModel({
      type: 'score.userName',
      message: 'no userName',
      isLiveMode: isLiveMode,
      time:Date.now()
    })
    newError.save();
    if(score.tempUser){
      score.userName = 'Anonymous';
    }
  }

  score.save(function(err,score){
    callback(err,score);
  })

}


//check overall leaderboards, and update accordingly
var checkOverall = function(newHighScore, callback) {
  console.log('checking overall');
  var isHighScore = false;
  //console.log("serverLeaderboard: ", serverLeaderboard)
  OverallLeaderboard.findById(serverLeaderboard)
    .populate('scores')
    .exec(function(err, leaderboard) {

      //console.log("OVERALL LEADERBOARD: ", leaderboard);
      // console.log(leaderboard.scores.length < leaderboardSize);
      // console.log(leaderboard.scores.length);
      // console.log(leaderboardSize)
      if(err||!leaderboard){
        console.log(err)
        return;
      }

      var overallHighScores = leaderboard.scores;
      overallHighScores.sort(sortScores);
      //console.log(overallHighScores)
      //console.log(newHighScore.score, overallHighScores[overallHighScores.length-1].score);

      if (overallHighScores.length < leaderboardSize) {
        //console.log("leaderboard undersize")
        overallHighScores.push(newHighScore);
        overallHighScores.sort(sortScores);
        // for (var score in overallHighScores) {
        //   if (score._id === newHighScore._id) {
        //     score = newHighScore._id;
        //     //console.log("score found")
        //     break;
        //   }
        // }
        isHighScore = true;
        //console.log("leaderboard about to save")
        leaderboard.save(function(err, leaderboard) {
          if (leaderboard && !err) {
            return callback(isHighScore);
          }
          else{
            console.log(err);
          }
        });
      } 
      else if (newHighScore.score > overallHighScores[leaderboard.scores.length - 1].score) {
        //console.log("leaderboard full, but highscore")
        overallHighScores.pop();
        overallHighScores.push(newHighScore);
        overallHighScores.sort(sortScores);
        // for (var score in overallHighScores) {
        //   if (score._id === newHighScore._id) {
        //     score = newHighScore._id;
        //     console.log("score found")
        //     break;
        //   }
        // }
        isHighScore = true;
        //console.log("overall leaderboard about to save")
        leaderboard.save(function(err, leaderboard) {
          //console.log("saving")
          if (leaderboard && !err) {
            //console.log("leaderboard save succeeded")
            return callback(isHighScore);
          }
          else{
            console.log(err);
          }
        });

      } else {
        return callback(isHighScore)
      }

    })
}

//update personal leaderboards (if !temp)
var checkMine = function(newHighScore, stats, callback) {
  var isHighScore = false;
  Leaderboard.findById(stats.leaderboard)
    .populate('scores')
    .exec(function(err, leaderboard) {

      //console.log(" MY LEADERBOARD: ", leaderboard)
      var myHighScores = leaderboard.scores;

      //console.log(myHighScores)

      if (myHighScores.length < leaderboardSize) {
        //console.log("my leaderboard undersize")
        myHighScores.push(newHighScore);
        myHighScores.sort(sortScores);
        //console.log(myHighScores)
        //console.log("myHighScores: ", myHighScores);
        //console.log("newHighScore: ", newHighScore)
        for (var score in myHighScores) {
          if (score._id === newHighScore._id) {
            score = newHighScore._id;
            //console.log("score found")
            break;
          }
        }
        isHighScore = true;
        //console.log("leaderboard about to save")
        leaderboard.save(function(err, leaderboard) {
          if(err){
          console.log("err: " + err);
          }
          //console.log("leaderboard: " + leaderboard)
          if (leaderboard && !err) {
            // console.log("leaderboard saved")
            // console.log(myHighScores)
            return callback(isHighScore);
          }
        });

      } else if (tempGame.score > myHighScores[myHighScores.length - 1].score) {
        //console.log("my leaderboard full, but highScore")
        myHighScores.pop();
        myHighScores.push(newHighScore);
        myHighScores.sort(sortScores);
        // for (var score in myHighScores) {
        //   if (score._id === newHighScore._id) {
        //     score = newHighScore._id;
        //     console.log("score found")
        //     break;
        //   }
        // }
        isHighScore = true;
        //console.log("leaderboard about to save")
        leaderboard.save(function(err, leaderboard) {
          if (leaderboard && !err) {
            //console.log(myHighScores)
            return callback(isHighScore);
          }
        });

      } else {
        return callback(isHighScore)
      }
    })
}

//sort score models
var sortScores = function(a, b) {
  return b.score - a.score
};

var checkLeaderboards = function(req,res,user,tempGame,newHighScore){

    //update personal and overall leaderboards
  
  checkOverall(newHighScore, function(isOverallHighScore) {

    
      checkMine(newHighScore,user.stats,function(isMyHighScore){
        isMyHighScore = isMyHighScore;

        if (isMyHighScore || isOverallHighScore) {

          tempGame.isHighScore = true;
          tempGame.save(function(err, game) {
            // console.log("isHighScore")
            // console.log("about to res.json success")
            // console.log(req.session.user.stats);
            //console.log(req.session.user);
            //console.log(tempGame,game);

            res.json({
              success: true
            })
          });

        } 
        else {
          //console.log("about to res.json success")
          res.json({
            success: true
          })
        }

      })
    //}
  })

}

//save game
router.post('/gameOver', function(req, res, next) {


  User.findById(req.session.user._id)
    .populate('currentGame stats')
    .exec(function(err, user) {

      //console.log(req.session.user.stats)
      // console.log(user);
      // console.log(user.stats)

      if (err) {
        console.log(err)
      }

      else if (user) {

        var tempGame = user.currentGame[0];
        //console.log(tempGame);



        //make score
        var newHighScore = new HighScore({
          scoreToStats:user.stats._id,
          dateAchieved: new Date(),
          score: tempGame.fullScore,
          nLevel: tempGame.nLevel,
          mode: tempGame.mode,
          reactionTimes: tempGame.reactionTimes,
          fromGameId: tempGame._id,
          scoreBoard:user.stats.leaderboard,
          tempUser:user.temp,
          userName: user.username
        })

        if(req.session.user.facebookId){
          newHighScore.FBname = req.session.user.name;
        }

        if(!newHighScore.userName && user.name){
          newHighScore.userName = user.name;
        }
        else if(!newHighScore.userName && user.temp){
          newHighScore.userName = 'Anonymous';
        }
        

        //update maxN
        if (tempGame.nLevel > user.maxN[newHighScore.mode]) {
          user.maxN[newHighScore.mode] = nLevel;
        }
        if (newHighScore.nLevel === user.maxN[newHighScore.mode] && req.body.passedLevel) {
          user.maxN[newHighScore.mode]++;
          //console.log("advanced nLevel!")
        }

        user.save(function(err,user){
          //console.log("user saved")
          req.session.user = user;
          //check how scores compare on personal level;
          newHighScore.save(function(err, newHighScore) {
            //console.log(user.stats)

            //var stats = user.stats;

            //update Stats

            //console.log(user.stats.totalPoints, newHighScore.score)
            user.stats.totalPoints += newHighScore.score;
            user.stats.progress.push(newHighScore._id);

            user.stats.save(function(err, stats) {
              if(err){
                console.log(err);
              }
              //console.log('updated user stats', stats)
              //console.log("updated user", user)
              user.save(function(err,user){
                validateScore(newHighScore,function(err,score){
                  if(err){
                    res.json({success:false})
                  }
                  else if(score.score>0){
                    checkLeaderboards(req,res,user,tempGame,newHighScore);
                  }
                  else{
                    res.json({success:true})
                  }

                });
              })
              

              //return if user highscore, overall high score, new nLevel

            })


            //set game isHighScore, etc.
          })
      })
    }
  })
});



module.exports = router;
