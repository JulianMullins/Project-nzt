var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');

//DATA KEPT IN A CENTRAL LOCATION FOR EASY ADJUSTMENT

//modes: classic,relaxed,silent,advanced
var serverLeaderboard = '5799071df2049724272d4876';

var scoresToPass = {
  relaxed: {
    1: 110,
    2: 135,
    3: 120,
    4: 125,
    5: 140,
    6: 150,
    7: 175,
    8: 180,
    9: 190,
    10: 200
  },
  silent: {
    1: 300,
    2: 260,
    3: 300,
    4: 350,
    5: 400,
    6: 500,
    7: 700,
    8: 800,
    9: 1000,
    10: 1200
  },
  classic: {
    1: 300,
    2: 260,
    3: 300,
    4: 350,
    5: 400,
    6: 500,
    7: 700,
    8: 800,
    9: 1000,
    10: 1200
  },
  advanced: {
    1: 525,
    2: 750,
    3: 1000,
    4: 1200,
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
