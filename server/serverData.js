var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');

//modes: classic,relaxed,silent,advanced

<<<<<<< HEAD
<<<<<<< HEAD
var serverLeaderboard=null;
//serverLeaderboard.save();
=======
var serverLeaderboard= '5799071df2049724272d4876';
>>>>>>> refs/remotes/origin/master
=======
var serverLeaderboard = '5799071df2049724272d4876';
>>>>>>> 5972e61146a996d43c4bf93ee47bcd6fbab29d15



var modeMultiplier = {
  classic: 1,
  relaxed: 1,
  silent: 1,
  advanced: 1
}

var penaltyPoints = 5;
var positivePoints = 10;
var leaderboardSize = 5;

module.exports = {
  serverLeaderboard: serverLeaderboard,
  modeMultiplier:modeMultiplier,
  penalty:penaltyPoints,
  positivePoints:positivePoints,
  leaderboardSize:leaderboardSize
}
