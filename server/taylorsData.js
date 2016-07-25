var express = require('express');
var app = express.Router();
var React = require('react');

var User = require('../models/User');
var Leaderboard = require('../models/Leaderboard');
var HighScore = require('../models/HighScore');
var Game = require('../models/Game');
var Stats = require('../models/stats')

var tempGame = null;

// app.get('/#/stats', function(req,res,next){
// 	console.log('workds')
// })

//TAYLOR'S SAD ATTEMPT AT PUSHING DATA INTO STATS GRAPHS
app.get('/taylorsStats', function(req,res,next){
  console.log('workds')
  if(err){
  	res.send(err)
  }
  else{
  	 res.json({gameId: game._id,tempUser:tempUser})
  }
})


module.exports=app;
