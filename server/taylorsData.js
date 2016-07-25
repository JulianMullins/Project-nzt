var express = require('express');
var app = express.Router();
var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');
var Stats = require('../models/stats')

var tempGame = null;


///TAYLOR'S SAD ATTEMPT AT PUSHING DATA INTO STATS GRAPHS
app.get('/stats', function(req,res,next){
  console.log('workds')
})


module.exports=app;
