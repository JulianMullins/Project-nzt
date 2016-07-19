var HighScore = require('../models/HighScore');
var User = require('../models/HighScore');
var Leaderboard = require('../models/Leaderboard');
var serverLeaderboardId = require('./serverData').serverLeaderboard;
var express = require('express');
var router = express.Router();

router.get('/myHighScores',function(req,res,next){
  return user.stats.leaderboard.scores;
})

//modes: classic,relaxed,silent,advanced

router.get('/allHighScores',function(req,res,next){
  Leaderboard.findById(serverLeaderboardId,function(err,leaderboard){
    if(err){
      res.send(err)
    }
    else{
      return leaderboard.scores;
    }
  })
});

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

router.post('/gameOver',function(req,res,next){

  //make score
  var newScore = req.body.score;
  var newHighScore = new HighScore({
    user:req.user._id,
    dateAchieved: new Date(),
    score: req.body.score,
    nLevel: req.body.nLevel,
    mode:req.params.mode
  })

  //check how scores compare on personal level;
  var myHighScores = user.stats.leaderboard.scores;
  if(myHighScores.length<process.env.leaderboardSize){
    myHighScores.push(newHighScore);
    myHighScores.sort();
  }
  else if(req.body.score>myHighScores[myHighScores.length-1].score){
    myHighScores.pop();
    myHighScores.push(newHighScore);
    myHighScores.sort();
  }
  else{
    return myHighScores;
  }

  //check overall leaderboard
  var leaderboard =null;
  setLeaderboard(serverLeaderboardId,function(err,serverLeaderboard){
    leaderboard = serverLeaderboard.scores;
  })
  if(myHighScores[0] == newScore){
    if(leaderboard.size<process.env.leaderboardSize){
      leaderboard.push(newHighScore);
      leaderboard.sort();
    }
    else if(newScore>leaderboard[leaderboard.length-1].score){
      leaderboard.pop();
      leaderboard.push(newHighScore);
      leaderboard.sort();
    }
    else{
      return myHighScores;
    }
  }
  else{
    return myHighScores;
  }

  //update stats
  var stats = req.user.stats;
  stats.totalPoints += newScore;
  stats.progress = stats.progress.push([new Date(),stats.totalPoints]);


  return leaderboard;
});

module.exports = router;
