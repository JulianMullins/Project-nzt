var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');

//modes: classic,relaxed,silent,advanced

var serverLeaderboards={
  classic: new Leaderboard({mode:'classic'}),
  relaxed: new Leaderboard({mode:'relaxed'}),
  silent: new Leaderboard({mode:'silent'}),
  advanced: new Leaderboard({mode:'advanced'})
}

module.exports = serverLeaderboards
