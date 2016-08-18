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

var processDate = function(date){
  var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

var processScores = function(scores,res){
  var result = [];
  if (scores.length == 0) {
    res.json({success:true,data:result});
  } 
  else {
    var i = 1;

    scores.sort(sortScores);
    scores = scores.filter(function(score,index){
      if(index>0 && score._id==scores[index-1]._id){
        return false;
      }
      else{
        return true;
      }
    })
    scores.map(function(score) {
      result.push({
        rank: i,
        mode: score.mode,
        level: score.nLevel,
        score: parseInt(score.score),
        username: score.userName,
        date:processDate(score.dateAchieved)
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
      //console.log(err,myFriendsLeaderboard)
      if(err){
        res.json({success:false});
      }
      else if(!myFriendsLeaderboard || !myFriendsLeaderboard.friends){
        res.json({success:true, friends:null})
      }
      // else if(!myFriendsLeaderboard.friends){
      //   return;
      // }
      else{
        myFriendsLeaderboard.unique(function(myFriendsLeaderboard){
          //console.log(myFriendsLeaderboard)
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
              //console.log(mfl.scores)
              
              FriendsLeaderboard.findById(mfl._id)
              .populate('scores')
              .exec(function(err,mfl){
                mfl.scores.sort(sortScores);
                //console.log(mfl.scores)
                processScores(mfl.scores,res)
              })
              
              

            }
          })
        })
      }


    })

  }
})
  


  


module.exports = router;
