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

//populate leaderboard, essentially
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

//check overall leaderboards, and update accordingly
var checkOverall = function(newHighScore){
  Leaderboard.findById(serverLeaderboard)
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
        leaderboard.save();
    })
}


//update personal leaderboards (if !temp)
var checkMine = function(newHighScore,stats){
  Leaderboard.findById(stats.leaderboard)
    .populate('scores')
    .exec(function(err,leaderboard){
      console.log(leaderboard)
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

      leaderboard.save();
    })
}

//sort score models
var sortScores = function(a,b){
  return a.score-b.score
}

//save game
router.post('/gameOver',function(req,res,next){

  console.log("posting gameover")

  //check if tempUser
  if(req.body.userId){
  TempUser.findById(req.body.userId)
    .populate('currentGame','stats')
    .exec(function(err,tempUser){

      if(tempUser){

      var tempGame = tempUser.currentGame[0];

      //make new score
      var newHighScore = new HighScore({
        user: tempUser._id,
        dateAchieved: new Date(),
        score: tempGame.score,
        nLevel: tempGame.nLevel,
        mode: tempGame.mode,
        reactionTimes:tempGame.reactionTimes
      })

      
      //newHighScore.user = req.body.anonUserName;

      //check overall stats
      checkOverall(newHighScore);    
      
      //update maxN
      if(nLevel>tempUser.maxN[newHighScore.mode]){
        tempUser.maxN[newHighScore.mode] = nLevel;
      }

      //return scoreId, userId, gameId, if overall high score

      }
    })
  }

  //check if full user
  console.log("not temp user")
  User.findById(req.user._id)
    .populate('stats currentGame')
    .exec(function(err,user){
      if(err){
        console.log(err)
      }

      if(user) {
        console.log('full user found in POST:/gameOver')
        console.log(user);
        console.log(user.stats)
        var tempGame = user.currentGame[0];

        var passedLevel = req.body.passedLevel;

        //make score
        var newHighScore = new HighScore({
          user: user._id,
          dateAchieved: new Date(),
          score: tempGame.score,
          nLevel: tempGame.nLevel,
          mode: tempGame.mode,
          reactionTimes:tempGame.reactionTimes
        })

        //update maxN if passedLevel:

        if(newHighScore.nLevel>user.maxN[newHighScore.mode]){

          user.maxN[newHighScore.mode] = nLevel;
        }
        if(newHighScore.nLevel === user.maxN[newHighScore.mode] && passedLevel){
          user.maxN[newHighScore.mode]++;
        }

          //check how scores compare on personal level;
          
          console.log('user stats', user.stats)
          //update Stats
          user.stats.totalPoints += newHighScore.score;
          user.stats.progress = user.stats.progress.push(newHighScore._id);
          
          user.stats.save(function(err,stats){
             console.log('updated user stats', user.stats)
          })

          //update personal and overall leaderboards
          checkMine(newHighScore,user.stats)
          checkOverall(newHighScore)

          //return if user highscore, overall high score, new nLevel


          //set game isHighScore, etc.

      }
     
    
    })
  
  
});


//new function, for tempUser gameOver routes 
  //(either save with tempname, or login/register and combine stats/data)
router.post('/gameOver/finish',function(req,res){

  //req.body: gameId,userId,scoreId

  //if don't want to login, use temp username
  if(req.user && !req.user.temp){

//update user stats
      TempUser.findById(req.body.userId)
        .populate('stats')
        .exec(function(err,tempUser){

          req.user.stats.combineStats(tempUser.stats);
          req.user.combineMaxN(tempUser.maxN);
          req.user.currentGame = tempUser.currentGame;
        })

        HighScore.findById(req.body.scoreId,function(err,score){
          score.user = req.user._id;
          score.save();
        })

        req.user.save();


  }

  //for gameOver/login and gameOver/register routes
  else{

    //save score information with inputed username

    HighScore.findById(req.body.scoreId,function(err,score){
          score.tempUserName = req.body.anonUserName;
          score.save();
        })

  }

})


module.exports=router;