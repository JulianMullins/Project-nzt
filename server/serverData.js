var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');

//DATA KEPT IN A CENTRAL LOCATION FOR EASY ADJUSTMENT

//modes: classic,relaxed,silent,advanced
var serverLeaderboard = '5799071df2049724272d4876';

var scoresToPass = {
  relaxed: {
    1: 100,
    2: 135,
    3: 165,
    4: 180,
    5: 200,
    6: 220,
    7: 245,
    8: 260,
    9: 280,
    10: 300
  },
  silent: {
    1: 300,
    2: 480,
    3: 600,
    4: 640,
    5: 600,
    6: 720,
    7: 700,
    8: 800,
    9: 1760,
    10: 1920
  },
  classic: {
    1: 300,
    2: 480,
    3: 600,
    4: 640,
    5: 600,
    6: 720,
    7: 700,
    8: 800,
    9: 1760,
    10: 1920
  },
  advanced: {
    1: 675,
    2: 1080,
    3: 1350,
    4: 1440,
    5: 1350,
    6: 1620,
    7: 1575,
    8: 1800,
    9: 1620,
    10: 1800
  }
}

var modeMultiplier = {
  relaxed: 1,
  silent: 2,
  classic: 2,
  advanced: 3
}

var penaltyPoints = 5;
var positivePoints = 10;
var leaderboardSize = 1000;

module.exports = {
  serverLeaderboard: serverLeaderboard,
  modeMultiplier: modeMultiplier,
  penalty: penaltyPoints,
  positivePoints: positivePoints,
  leaderboardSize: leaderboardSize,
  scoresToPass: scoresToPass
}
