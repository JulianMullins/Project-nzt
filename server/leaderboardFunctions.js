var HighScore = require('../models/HighScore');
var Leaderboard = require('../models/Leaderboard');
var OverallLeaderboard = require('../models/OverallLeaderboard');
var User = require('../models/User');
var Stats = require('../models/Stats');
var FriendsLeaderboard = require('../models/FriendsLeaderboard');
var leaderboardSize = require('./serverData').leaderboardSize;
var serverLeaderboardId = require('./serverData').serverLeaderboard;
var express = require('express');
var router = express.Router();




//sort score models
var sortScores = function(a, b) {
  return b.score - a.score
};

var processScores = function(scores,res){
  var result = [];
  if (scores.length == 0) {
    res.json({success:true,data:result});
  } 
  else {
    var i = 1;
    scores.sort(sortScores);
    scores.map(function(score) {
      result.push({
        rank: i,
        mode: score.mode,
        level: score.nLevel,
        score: parseInt(score.score)
      });
      i++;
    });
    res.json({success:true,data:result});
  }
}

router.get('/myHighScores', function(req, res, next) {
  User.findById(req.session.user._id)
    .populate('stats')
    .exec(function(err, user) {
      if (err) {
        res.json({success:false})
      } 
      else {
        Leaderboard.findById(user.stats.leaderboard)
          .populate('scores')
          .exec(function(err, leaderboard) {
            if (err) {
              res.json({success:false})
            } 
            else {
              processScores(leaderboard.scores,res)
            }
          });
      }
    });
});

router.get('/allHighScores', function(req, res, next) {
  
  OverallLeaderboard.findById(serverLeaderboardId)
    .populate('scores')
    .exec(function(err, leaderboard) {
      if (err) {
        console.log('err', err);
      } else {
        //console.log(leaderboard.scores);

        processScores(leaderboard.scores,res)
      }
    });

});


router.get('/friendScores',function(req,res,next){
  console.log("AT FRIEND SCORES")
  if(!req.session|| !req.session.user || !req.session.user.facebookId){
    console.log("You have no friends");
    res.json({success:true, friends:null})
  }
  else{
    
    FriendsLeaderboard.findById(req.session.user.friendsLeaderboard)
    .populate('friends')
    .exec(function(err,myFriendsLeaderboard){
      console.log(err,myFriendsLeaderboard)
      if(err){
        res.json({success:false});
        return;
      }
      else if(!myFriendsLeaderboard || !myFriendsLeaderboard.friends){
        res.json({success:true, friends:null})
        return;
      }
      // else if(!myFriendsLeaderboard.friends){
      //   return;
      // }
      for(var i=0;i<myFriendsLeaderboard.friends.length;i++){
        User.findById(myFriendsLeaderboard.friends[i])
          .populate('stats')
          .exec(function(err,user){
            myFriendsLeaderboard.scores = myFriendsLeaderboard.scores.concat(user.stats.progress)
            myFriendsLeaderboard.save();
          })
      }
      myFriendsLeaderboard.save(function(err,mfl){
        if(err||!mfl){
          res.json({success:false})
        }
        else{
          console.log(mfl.scores)
          processScores(mfl.scores,res)
        }
      })


    })

  }
})
  


  


module.exports = router;
