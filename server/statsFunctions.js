var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Stats=require('../models/Stats')
var Leaderboards=require('../models/Leaderboard')
var Highscores=require('../models/HighScore')

var tempGame = null;

router.get('/getStats',function(req, res, next){

  Stats.findById(req.session.user.stats._id)
    .populate('progress')
    .exec(function(err,stats){
      if(err){
        console.log(err)
      }
      else{
        console.log(stats);
        res.json({stats: stats.progress})
      }
  })

    //res.json({stats:req.session.user.stats.progress})

});


  module.exports=router;