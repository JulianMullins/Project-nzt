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
          for (var score in myHighScores){
            if(score===newHighScore.score){
              score = newHighScore._id;
            }
          }
        }
        else if(newHighScore.score > leaderboard[leaderboard.length-1].score){
          leaderboard.pop();
          leaderboard.push(newHighScore);
          leaderboard.sort(sortScores);
          for(var score in myHighScores){
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
        for (var score in myHighScores){
          if(score===newHighScore){
            score = newHighScore._id
          }
        }
      }
      else if(tempGame.score>myHighScores[myHighScores.length-1].score){
        myHighScores.pop();
        myHighScores.push(newHighScore);
        myHighScores.sort(sortScores);
        for(var score in myHighScores){
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

  TempUser.findById(req.body.userId)
    .populate('currentGame','stats')
    .exec(function(err,tempUser){

      var tempGame = tempUser.currentGame[0];

      var newHighScore = new HighScore({
        user: tempUser._id,
        dateAchieved: new Date(),
        score: tempGame.score,
        nLevel: tempGame.nLevel,
        mode: tempGame.mode,
        reactionTimes:tempGame.reactionTimes
      })

      
      newHighScore.user = req.body.inputUsername;
      checkOverall(newHighScore);    
      
    
      if(nLevel>tempUser.maxN[newHighScore.mode]){
        tempUser.maxN[newHighScore.mode] = nLevel;
      }

      tempUser.stats.high

      

    })

  User.findById(req.user._id)
    .populate('currentGame', 'stats')
    .exec(function(err,user){
    

      //make score
      var tempGame = user.currentGame[0];

      var newHighScore = new HighScore({
        user: user._id,
        dateAchieved: new Date(),
        score: tempGame.score,
        nLevel: tempGame.nLevel,
        mode: tempGame.mode,
        reactionTimes:tempGame.reactionTimes
      })

      
      if(nLevel>user.maxN[newHighScore.mode]){
        user.maxN[newHighScore.mode] = nLevel;
        }

        //check how scores compare on personal level;
        

        user.stats.totalPoints += newScore;
        user.stats.progress = user.stats.progress.push(newHighScore._id);
        
        checkMine(newHighScore,user.stats)
        checkOverall(newHighScore)

    
    })
  
  
});

router.post('/gameOver/finish',function(req,res){

  if(req.user){

//update user stats

  }
  else{

    //save score information with inputed username

  }

})


module.exports=router;