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
        //console.log(stats);
        var maxN = 0;
        for (var key in req.session.user.maxN) {
          if (req.session.user.maxN[key] > maxN) {
            maxN = req.session.user.maxN[key];
          }
        }

        var highScore = 0;
        for(var i=0;i<stats.progress.length;i++){
          if(stats.progress[i].score>highScore){
            highScore = stats.progress[i].score
          }
        }


        res.json({
          stats: stats.progress,
          maxN: maxN,
          highScore:highScore,
          fullName: req.session.user.name
        })


      }
  })

    //res.json({stats:req.session.user.stats.progress})

});






  module.exports=router;