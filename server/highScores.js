var HighScore = require('../models/HighScore');
var Leaderboard = require('../models/Leaderboard');
var OverallLeaderboard = require('../models/OverallLeaderboard');
var User = require('../models/User');
var leaderboardSize = require('./serverData').leaderboardSize;
var serverLeaderboardId = require('./serverData').serverLeaderboard;
var express = require('express');
var router = express.Router();

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
              username: score.userName
            });
            i++;
          });
          res.json(result);
        }
      }
    });
});

module.exports = router;
