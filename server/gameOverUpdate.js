var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');
var Stats = require('../models/Stats');

var serverLeaderboard = require('./serverData').serverLeaderboard;
var leaderboardSize = require('./serverData').leaderboardSize;

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


var checkOverall = function(newHighScore){
  Leaderboard.findbyId(serverLeaderboard)
    .populate('scores')
    .exec(function(err,leaderboard){

        if(leaderboard.size<leaderboardSize){
          leaderboard.push(newHighScore);
          leaderboard.sort(sortScores);
          forEach (var score in myHighScores){
            if(score===newHighScore.score){
              score = newHighScore._id
            }
          }
        }
        else if(newHighScore.score>leaderboard[leaderboard.length-1].score){
          leaderboard.pop();
          leaderboard.push(newHighScore);
          leaderboard.sort(sortScores);
          forEach (var score in myHighScores){
            if(score===newHighScore.score){
              score = newHighScore._id
            }
          }
        }
    })
}

checkMine = function(newHighScore,stats){
  Leaderboard.findById(stats.leaderboard)
    .populate('scores')
    .exec(function(err,leaderboard){

      var myHighScores = leaderboard.scores;

      if(myHighScores.length<leaderboardSize){
        myHighScores.push(newHighScore);
        myHighScores.sort(sortScores);
        forEach (var score in myHighScores){
          if(score===newHighScore){
            score = newHighScore._id
          }
        }
      }
      else if(tempGame.score>myHighScores[myHighScores.length-1].score){
        myHighScores.pop();
        myHighScores.push(newHighScore);
        myHighScores.sort(sortScores);
        forEach (var score in myHighScores){
          if(score===newHighScore){
            score = newHighScore._id
          }
        }
      }
    })
}


var sortScores = function(a,b){
  return a.score-b.score
}

//save game
router.post('/gameOver',function(req,res,next){

  User.findById(req.user._id)
    .populate('currentGame')
    .exec(function(err,user){
    

      //make score
      var tempGame = user.currentGame

      var newHighScore = new HighScore({
        user: user._id,
        dateAchieved: new Date(),
        score: tempGame.score,
        nLevel: tempGame.nLevel,
        mode: tempGame.mode,
        reactionTimes:tempGame.reactionTimes
      })

      if(user.temp){
        newHighScore.user = req.body.inputUsername;
        checkOverall(newHighScore);    
      }

      else{
        if(nLevel>user.maxN[newHighScore.mode]){
          user.maxN[newHighScore.mode] = nLevel;
        }

        //check how scores compare on personal level;
        Stats.findById(user.stats,function(err,stats){

            stats.totalPoints += newScore;
            stats.progress = stats.progress.push(newHighScore._id);
            
            checkMine(newHighScore,stats)
            checkOverall(newHighScore)
        })

      }

    
    })
  })
  
});


module.exports=router;