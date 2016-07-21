var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');
var Stats = require('../models/Stats');

//functions for save game
var setLeaderboard = function(id,callback){
  Leaderboard.findById(id,function(err,leaderboard){
    if(err){
      callback(err);
    }
    else{
      callback(false,leaderboard);
    }
  })
}

var sortScores = function(a,b){
  return a.score-b.score
}

//save game
router.post('/gameOver',function(req,res,next){

  //make score
  var newScore = req.body.score;
  var newHighScore = new HighScore({
    user: req.user._id,
    dateAchieved: new Date(),
    score: req.body.score,
    nLevel: tempGame.nLevel,
    mode: tempGame.mode
  })

  //check how scores compare on personal level;
  Stats.findById(req.user.stats,function(err,stats){

    Leaderboard.findById(stats.leaderboard)
      .populate('scores')
      .exec(function(err,leaderboard){

        var myHighScore = leaderboard.scores;

        if(myHighScores.length<leaderboardSize){
          myHighScores.push(newHighScore);
          myHighScores.sort(sortScores);
          forEach (var score in myHighScores){
            if(score===newHighScore){
              score = newHighScore._id
            }
          }
        }
        else if(req.body.score>myHighScores[myHighScores.length-1].score){
          myHighScores.pop();
          myHighScores.push(newHighScore);
          myHighScores.sort(sortScores);
          forEach (var score in myHighScores){
            if(score===newHighScore){
              score = newHighScore._id
            }
          }
        }

        //check overall leaderboard
        var leaderboard =null;
        setLeaderboard(serverLeaderboardId,function(err,serverLeaderboard){
          leaderboard = serverLeaderboard.scores;
        })
        if(myHighScores[0] == newScore){
          if(leaderboard.size<leaderboardSize){
            leaderboard.push(newHighScore);
            leaderboard.sort(sortScores);
            forEach (var score in myHighScores){
              if(score===newHighScore){
                score = newHighScore._id
              }
            }
          }
          else if(newScore>leaderboard[leaderboard.length-1].score){
            leaderboard.pop();
            leaderboard.push(newHighScore);
            leaderboard.sort(sortScores);
            forEach (var score in myHighScores){
              if(score===newHighScore){
                score = newHighScore._id
              }
            }
          }

        }

        //update stats
        stats.totalPoints += newScore;
        stats.progress = stats.progress.push([newHighScore.dateAchieved,stats.totalPoints]);


        return leaderboard;

      })

  })
  
});


module.exports=router;