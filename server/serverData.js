var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');

//modes: classic,relaxed,silent,advanced
var serverLeaderboard=null;
//serverLeaderboard.save();



var modeMultiplier = {
  classic: 5,
  relaxed: 10,
  silent: 15,
  advanced: 20
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
