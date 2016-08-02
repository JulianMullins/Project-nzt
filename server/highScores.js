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
                leaderboard.scores.sort(function(a, b) {
                  return b.score - a.score;
                });
                leaderboard.scores.map(function(score) {
                  result.push({
                    mode: score.mode,
                    username: user.username,
                    level: score.nLevel,
                    score: parseInt(score.score)
                  });
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

router.get('/allHighScores', function(req, res, next) {
  Leaderboard.findById(serverLeaderboardId)
    .populate('scores')
    .exec(function(err, leaderboard) {
      if (err) {
        console.log(err)
      } else {
        var result = [];
        leaderboard.scores.sort(function(a, b) {
          return b.score - a.score;
        });
        var i = 1;
        leaderboard.scores.map(function(score) {
          var tmp = {
            rank: i
          };
          User.findById(score.user, function(err, u) {
            if (err) {
              return;
            }
            tmp['mode'] = score.mode;
            tmp['username'] = u.username;
            tmp['score'] = parseInt(score.score);
            tmp['leve'] = score.nLevel;
            result.push(tmp);
            if (result.length == leaderboard.scores.length) {
              res.json(result);
            }
          });
          i++;
        });
      }
    });
});

module.exports = router;
