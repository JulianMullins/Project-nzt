var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');

//modes: classic,relaxed,silent,advanced

var serverLeaderboard=new Leaderboard();
serverLeaderboard.save();

module.exports = serverLeaderboard._id
