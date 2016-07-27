var HighScore = require('../models/HighScore');
var User = require('../models/HighScore');
var Leaderboard = require('../models/Leaderboard');
var User = require('../models/User');
var leaderboardSize = require('./serverData').leaderboardSize;
var serverLeaderboardId = require('./serverData').serverLeaderboard;
var express = require('express');
var router = express.Router();

router.get('/myHighScores', function(req, res, next) {
  res.json(user.stats.leaderboard.scores);
})

//modes: classic,relaxed,silent,advanced

router.get('/allHighScores', function(req, res, next) {
  // var hs = new HS({
  //   user: '5797d0a4d398ed61377bc618',
  //   dateAchieved: new Date(),
  //   score: 70,
  //   nLevel: 2,
  //   mode: 'Classic',
  //   reactionTimes: []
  // });
  // hs.save();

  Leaderboard.findById(serverLeaderboardId)
    .populate('scores')
    .exec(function(err, leaderboard) {
      if (err) {
        console.log(err)
      } else {
        var result = [];
        leaderboard.scores.map(function(score) {
          User.findById(score.user, function(err, u) {
            result.push({
              mode: score.mode,
              username: u.username,
              level: score.nLevel,
              score: score.score
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
