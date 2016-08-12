var HighScore = require('../models/HighScore');
var Leaderboard = require('../models/Leaderboard');
var OverallLeaderboard = require('../models/OverallLeaderboard');
var User = require('../models/User');
var Stats = require('../models/Stats');
var leaderboardSize = require('./serverData').leaderboardSize;
var serverLeaderboardId = require('./serverData').serverLeaderboard;
var express = require('express');
var router = express.Router();



//sort score models
var sortScores = function(a, b) {
  return b.score - a.score
};

router.get('/myHighScores', function(req, res, next) {
  User.findById(req.session.user._id)
    .populate('stats')
    .exec(function(err, user) {
      if (err) {
        console.log(err);
      } else {
        Leaderboard.findById(user.stats.leaderboard)
          .populate('scores')
          .exec(function(err, leaderboard) {
            if (err) {
              console.log(err);
            } else {
              var result = [];
              if (leaderboard.scores.length == 0) {
                res.json(result);
              } else {
                var i = 1;
                leaderboard.scores.sort(sortScores);
                leaderboard.scores.map(function(score) {
                  result.push({
                    rank: i,
                    mode: score.mode,
                    level: score.nLevel,
                    score: parseInt(score.score)
                  });
                  i++;
                });
                res.json(result);
              }
            }
          });
      }
    });
});

router.get('/allHighScores', function(req, res, next) {
  
  OverallLeaderboard.findById(serverLeaderboardId)
    .populate('scores')
    .exec(function(err, leaderboard) {
      if (err) {
        console.log('err', err);
      } else {
        var result = [];
        if (leaderboard.scores.length == 0) {
          res.json(result);
        } else {
          var i = 1;
          leaderboard.scores.map(function(score) {
            
            result.push({
              rank: i,
              mode: score.mode,
              score: parseInt(score.score),
              level: score.nLevel,
              username: score.userName || score.username
            });
            i++;
          });
          res.json(result);
        }
      }
    });



  // HighScore.find().populate('scoreToStats user').exec(function(err,highScores){
  //   if(err){
  //     console.log(err);
  //   }
  //   else{
  //     highScores.forEach(function(highScore){
  //       //console.log("checking score")
  //       if(!highScore.userName){
  //         //console.log(highScore)

  //         if(highScore.user){
  //           highScore.userName = highScore.user.username;
  //           highScore.save(function(err,highScore){
  //               if(err){
  //                 console.log(err)
  //               }
  //               else{
  //                 console.log("success")
  //               }
  //             })
  //         }

  //         else if(highScore.scoreToStats && highScore.scoreToStats.statsUser){
  //           User.findById(highScore.scoreToStats.statsUser,function(err,user){
  //             highScore.userName = user.username;

  //             highScore.save(function(err,highScore){
  //               if(err){
  //                 console.log(err)
  //               }
  //               else{
  //                 console.log("success")
  //               }
  //             })

  //           })
  //         }
  //         else if(highScore.scoreToStats && highScore.scoreToStats.user){
  //           User.findById(highScore.scoreToStats.user,function(err,user){
  //             highScore.userName = user.username;

  //             highScore.save(function(err,highScore){
  //               if(err){
  //                 console.log(err)
  //               }
  //               else{
  //                 console.log("success")
  //               }
  //             })

  //           })
  //         }
          
  //       }
  //     })
  //   }
  // })


  
});

module.exports = router;
