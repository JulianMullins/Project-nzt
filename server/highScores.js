var HighScore = require('../models/HighScore');
var User = require('../models/HighScore');
var Leaderboard = require('../models/Leaderboard');
var serverLeaderboards = require('./serverData')
var express = require('express');
var router = express.Router();

router.get('/myHighScores/:mode',function(req,res,next){
  return user.highScores[req.params.mode];
})

//modes: classic,relaxed,silent,advanced

router.get('/allHighScores/:mode',function(req,res,next){
  Leaderboard.findOne({mode:req.params.mode},function(err,leaderboard){
    if(err){
      return next(err);
    }
    else{
      return leaderboard.scores;
    }
  })
});

router.post('/gameOver/:mode',function(req,res,next){
  //check how scores compare on personal level;
  var newScore = req.body.score;
  var newHighScore = new HighScore({
    user:req.user._id,
    dateAchieved: new Date(),
    score: req.body.score,
    nLevel: req.body.nLevel,
    mode:req.params.mode
  })

  var myHighScores = user.highScores[req.params.mode];
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
  var leaderboard =serverLeaderboards[req.params.mode];
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

  return leaderboard;
});

module.exports = router;
