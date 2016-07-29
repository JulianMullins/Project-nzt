var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');

//DATA KEPT IN A CENTRAL LOCATION FOR EASY ADJUSTMENT


//modes: classic,relaxed,silent,advanced
var serverLeaderboard='5799071df2049724272d4876';

<<<<<<< HEAD

=======
var scoresToPass={
	classic:{
		1: 150,
		2: 240,
		3: 300,
		4: 320,
		5: 300,
		6: 360,
		7: 350,
		8: 400,
		9: 360,
		10: 400
	},
	relaxed:{
		1: 10,
		2: 60,
		3: 75,
		4: 80,
		5: 75,
		6: 90,
		7: 90,
		8: 100,
		9: 90,
		10: 100
	},
	silent:{
		1: 150,
		2: 240,
		3: 300,
		4: 320,
		5: 300,
		6: 360,
		7: 350,
		8: 400,
		9: 360,
		10: 400
	},
	advanced:{
		1: 340,
		2: 540,
		3: 675,
		4: 720,
		5: 675,
		6: 810,
		7: 800,
		8: 900,
		9: 810,
		10: 900
	}
}
>>>>>>> origin/master


var modeMultiplier = {
  classic: 5,
  relaxed: 10,
  silent: 15,
  advanced: 20
}

var penaltyPoints = 5;
var positivePoints = 10;
var leaderboardSize = 15;

module.exports = {
  serverLeaderboard: serverLeaderboard,
  modeMultiplier:modeMultiplier,
  penalty:penaltyPoints,
  positivePoints:positivePoints,
  leaderboardSize:leaderboardSize
}
