var HighScore = require('../models/HighScore');
var Leaderboard = require('../models/Leaderboard');
var User = require('../models/User');
var leaderboardSize = require('./serverData').leaderboardSize;
var serverLeaderboardId = require('./serverData').serverLeaderboard;
var express = require('express');
var router = express.Router();

router.get('/myHighScores', function(req, res, next) {
  User.findById(req.user._id)
    .populate('stats')
    .exec(function(err, user) {
      console.log(user.username);
      if (!err) {
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
                leaderboard.scores.map(function(score) {
                  result.push({
                    mode: score.mode,
                    username: user.username,
                    level: score.nLevel,
                    score: parseInt(score.score)
                  });
                  console.log(result);
                  if (result.length == leaderboard.scores.length) {
                    res.json(result);
                    return;
                  }
                });
              }
            }
          });
      }
    });
});

//modes: classic,relaxed,silent,advanced

//ADAM
router.get('/allHighScores', function(req, res, next) {
  Leaderboard.findById(serverLeaderboardId)
    .populate('scores')
    .exec(function(err, leaderboard) {
      if (err) {
        console.log(err)
      } else {
        console.log(leaderboard);
        var result = [];
        leaderboard.scores.map(function(score) {
          User.findById(score.user, function(err, u) {
            result.push({
              mode: score.mode,
              username: u.username,
              level: score.nLevel,
              score: parseInt(score.score)
            });
            if (result.length == leaderboard.scores.length) {
              res.json(result);
            }
          });
        });
      }
    });
});

module.exports = router;
