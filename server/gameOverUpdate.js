var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');
var Stats = require('../models/Stats');

var serverData = require('./serverData');
//console.log(serverData);
var serverLeaderboard = require('./serverData').serverLeaderboard;
var leaderboardSize = require('./serverData').leaderboardSize;
var tempGame = {}; //RUTH I ADDED THIS BECAUSE I KEPT GETTING ERRORS WHEN TESTING OTHER STUFF
tempGame.score = 0; // AND THIS

//functions for save game

//populate leaderboard, essentially
var setLeaderboard = function(id, callback) {
  Leaderboard.findById(id, function(err, leaderboard) {
    if (err) {
      callback(err);
    } else {
      callback(false, leaderboard);
    }
  })
}

//check overall leaderboards, and update accordingly
var checkOverall = function(newHighScore, callback) {
  console.log('checking overall');
  var isHighScore = false;
  Leaderboard.findById(serverLeaderboard)
    .populate('scores')
    .exec(function(err, leaderboard) {

      // console.log("OVERALL LEADERBOARD: ", leaderboard);
      // console.log(leaderboard.scores.length < leaderboardSize);
      // console.log(leaderboard.scores.length);
      // console.log(leaderboardSize)

      var overallHighScores = leaderboard.scores;
      overallHighScores.sort(sortScores);
      console.log(newHighScore.score, overallHighScores[leaderboard.scores.length-1].score);

      if (overallHighScores.length < leaderboardSize) {
        console.log("leaderboard undersize")
        overallHighScores.push(newHighScore);
        overallHighScores.sort(sortScores);
        for (var score in overallHighScores) {
          if (score._id === newHighScore._id) {
            score = newHighScore._id;
            console.log("score found")
            break;
          }
        }
        isHighScore = true;
        console.log("leaderboard about to save")
        leaderboard.save(function(err, leaderboard) {
          if (leaderboard && !err) {
            return callback(isHighScore);
          }
        });
      } else if (newHighScore.score > overallHighScores[leaderboard.scores.length - 1].score) {
        console.log("leaderboard full, but highscore")
        overallHighScores.pop();
        overallHighScores.push(newHighScore);
        overallHighScores.sort(sortScores);
        for (var score in overallHighScores) {
          if (score._id === newHighScore._id) {
            score = newHighScore._id;
            console.log("score found")
            break;
          }
        }
        isHighScore = true;
        console.log("leaderboard about to save")
        leaderboard.save(function(err, leaderboard) {
          if (leaderboard && !err) {
            return callback(isHighScore);
          }
        });

      } else {
        return callback(isHighScore)
      }

    })
}

//update personal leaderboards (if !temp)
var checkMine = function(newHighScore, stats, callback) {
  var isHighScore = false;
  Leaderboard.findById(stats.leaderboard)
    .populate('scores')
    .exec(function(err, leaderboard) {

      console.log(" MY LEADERBOARD: ", leaderboard)
      var myHighScores = leaderboard.scores;

      if (myHighScores.length < leaderboardSize) {
        console.log("my leaderboard undersize")
        myHighScores.push(newHighScore);
        myHighScores.sort(sortScores);
        //console.log("myHighScores: ", myHighScores);
        console.log("newHighScore: ", newHighScore)
        for (var score in myHighScores) {
          if (score._id === newHighScore._id) {
            score = newHighScore._id;
            console.log("score found")
            break;
          }
        }
        isHighScore = true;
        console.log("leaderboard about to save")
        leaderboard.save(function(err, leaderboard) {
          console.log("err: " + err);
          console.log("leaderboard: " + leaderboard)
          if (leaderboard && !err) {
            console.log("leaderboard saved")
            return callback(isHighScore);
          }
        });

      } else if (tempGame.score > myHighScores[myHighScores.length - 1].score) {
        console.log("my leaderboard full, but highScore")
        myHighScores.pop();
        myHighScores.push(newHighScore);
        myHighScores.sort(sortScores);
        for (var score in myHighScores) {
          if (score._id === newHighScore._id) {
            score = newHighScore._id;
            console.log("score found")
            break;
          }
        }
        isHighScore = true;
        console.log("leaderboard about to save")
        leaderboard.save(function(err, leaderboard) {
          if (leaderboard && !err) {
            return callback(isHighScore);
          }
        });

      } else {
        return callback(isHighScore)
      }
    })
}

//sort score models
var sortScores = function(a, b) {
  return b.score - a.score
};

//save game
router.post('/gameOver', function(req, res, next) {

  //check if tempUser
  if (req.body.userId) {
    console.log("checking tempUser")
    TempUser.findById(req.body.userId)
      .populate('currentGame stats')
      .exec(function(err, tempUser) {

        if (tempUser) {

          var tempGame = tempUser.currentGame[0];

          //make new score
          var newHighScore = new HighScore({
            user: tempUser._id,
            dateAchieved: new Date(),
            score: tempGame.score,
            nLevel: tempGame.nLevel,
            mode: tempGame.mode,
            reactionTimes: tempGame.reactionTimes
          })


          //newHighScore.user = req.body.anonUserName;

          //check overall stats
          checkOverall(newHighScore);

          //update maxN
          if (nLevel > tempUser.maxN[newHighScore.mode]) {
            tempUser.maxN[newHighScore.mode] = nLevel;
          }

          //return scoreId, userId, gameId, if overall high score
          res.json({
            success: false
          })
        }
      })
  }

  //check if full user
  User.findById(req.user._id)
    .populate('currentGame stats')
    .exec(function(err, user) {

      console.log(req.user.stats)

      if (err) {
        console.log(err)
      }

      if (user) {

        var tempGame = user.currentGame[0];

        //make score
        var newHighScore = new HighScore({
          user: user._id,
          dateAchieved: new Date(),
          score: tempGame.score,
          nLevel: tempGame.nLevel,
          mode: tempGame.mode,
          reactionTimes: tempGame.reactionTimes
        })

        //update maxN
        if (tempGame.nLevel > user.maxN[newHighScore.mode]) {
          user.maxN[newHighScore.mode] = nLevel;
        }
        if (newHighScore.nLevel === user.maxN[newHighScore.mode] && req.body.passedLevel) {
          user.maxN[newHighScore.mode]++;
          console.log("advanced nLevel!")
        }

        //check how scores compare on personal level;
        newHighScore.save(function(err, newHighScore) {
          console.log(user.stats)

          var stats = user.stats;

          //update Stats

          console.log(stats.totalPoints, newHighScore.score)
          stats.totalPoints += newHighScore.score;
          stats.progress.push(newHighScore._id);

          stats.save(function(err, stats) {
            console.log('updated user stats', stats)

            //update personal and overall leaderboards
            var isMyHighScore = null;
            var isOverallHighScore = null;

            checkMine(newHighScore, user.stats, function(isHighScore) {
              isMyHighScore = isHighScore;

              checkOverall(newHighScore, function(isOverallHighScore) {
                isOverallHighScore = isOverallHighScore;

                if (isMyHighScore || isOverallHighScore) {
                  tempGame.isHighScore = true;
                  tempGame.save(function(err, game) {
                    console.log("isHighScore")
                    console.log("about to res.json success")
                    console.log(req.user.stats)


                    user.save(function(err, user) {
                      if (!err) {
                        res.json({
                          success: true
                        })
                      }
                    })


                  });
                } else {
                  console.log("about to res.json success")
                  user.save(function(err, user) {
                    if (!err) {
                      res.json({
                        success: true
                      })
                    }
                  })
                }

              })
            })

            //return if user highscore, overall high score, new nLevel

          })


          //set game isHighScore, etc.
        })
      }
    })
});


//new function, for tempUser gameOver routes
//(either save with tempname, or login/register and combine stats/data)
router.post('/gameOver/finish', function(req, res) {

  //req.body: gameId,userId,scoreId

  //if don't want to login, use temp username
  if (req.user && !req.user.temp) {

    //update user stats
    TempUser.findById(req.body.userId)
      .populate('stats')
      .exec(function(err, tempUser) {

        req.user.stats.combineStats(tempUser.stats);
        req.user.combineMaxN(tempUser.maxN);
        req.user.currentGame = tempUser.currentGame;
      })

    HighScore.findById(req.body.scoreId, function(err, score) {
      score.user = req.user._id;
      score.save();
    })
    req.user.save();


  }

  //for gameOver/login and gameOver/register routes
  else {

    //save score information with inputed username

    HighScore.findById(req.body.scoreId, function(err, score) {
      score.tempUserName = req.body.anonUserName;
      score.save();
    })

  }


})


module.exports = router;
