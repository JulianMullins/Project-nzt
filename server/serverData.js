var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');

//modes: classic,relaxed,silent,advanced

var serverLeaderboard=new Leaderboard();
serverLeaderboard.save();


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
  serverLeaderboard: serverLeaderboard._id,
  modeMultiplier:modeMultiplier,
  penalty:penaltyPoints,
  positivePoints:positivePoints,
  leaderboardSize:leaderboardSize
}
