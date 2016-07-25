var HighScore = require('../models/HighScore');
var User = require('../models/HighScore');
var Leaderboard = require('../models/Leaderboard');
var leaderboardSize = require('./serverData').leaderboardSize;
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
      console.log(err)
    }
    else{
      return leaderboard.scores;
    }
  })
});



module.exports = router;
