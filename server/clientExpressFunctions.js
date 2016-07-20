var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');

var tempGame = null;

router.get('/isLoggedIn',function(req,res,next){
  res.json({'loggedIn': !!req.user})
})

router.post('/startGame/:mode/:nLevel',function(req,res,next){
  tempGame = new Game({
    user:req.user,
    mode:req.params.mode,
    score:0,
    nLevel:req.params.nLevel,
    tempUser:req.user.temp
  })
  tempGame.save(function(err,game){
    if(err){
      res.send(err);
    }
    else{
      res.json({gameId: game._id,tempUser:tempUser})
    }
  })
})


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
  var myHighScores = user.stats.leaderboard.scores;
  if(myHighScores.length<leaderboardSize){
    myHighScores.push(newHighScore);
    myHighScores.sort(sortScores);
  }
  else if(req.body.score>myHighScores[myHighScores.length-1].score){
    myHighScores.pop();
    myHighScores.push(newHighScore);
    myHighScores.sort(sortScores);
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
    if(leaderboard.size<leaderboardSize){
      leaderboard.push(newHighScore);
      leaderboard.sort(sortScores);
    }
    else if(newScore>leaderboard[leaderboard.length-1].score){
      leaderboard.pop();
      leaderboard.push(newHighScore);
      leaderboard.sort(sortScores);
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

module.exports=router;
