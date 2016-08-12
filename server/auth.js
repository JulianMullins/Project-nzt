var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var axios = require('axios');

var User = require('../models/User');
var Stats = require('../models/Stats');
var Leaderboard = require('../models/Leaderboard')


module.exports = function(passport) {

  // // GET registration page
  // router.get('/register', function(req, res) {
  //   res.render('register');
  // });


  var validateReq = function(userData) {

    //check if input all there
    console.log(userData)
    var errors=[];
    if(userData.password !== userData.passwordConfirm){
      errors.push("Passwords don't match");
    }
    if(!userData.password){
      errors.push('Password is required');
    }
    if(!userData.username){
      errors.push("Username is required");
    }
    if(!userData.email){
      errors.push("Email is required");
    }
    if(userData.username.length<6){
      errors.push("Username must be at least 6 characters long");
    }
    if(!userData.email.includes('@') || !userData.email.includes('.') || userData.email.includes('+')){
      errors.push("Invalid email");
    }
    if(userData.password.length<6){
      errors.push("Password must be at least 6 characters long");
    }
    return errors;
  };



  router.post('/register', function(req, res,next) {
    
    //didn't fill out form right
    var validationErrors = validateReq(req.body) 
    if (validationErrors.length!==0) {
      console.log("validation failed")
        res.json({success:false, message:validationErrors});
        return;
    }

    //check if user already exists
    User.findOne({username:req.body.username}).exec(function(err,userWithSameName){
      if(err){
        res.json({success:false});
        return;
      }

      //user already exists
      else if(!err && userWithSameName){
        console.log(userWithSameName, "register failed")
        res.json({success:false, message:'Username already exists'})
        return;
      }

      //create new user
      else{

        //encrypt password
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
              // Store hash in your password DB. 
              var password = hash;
              
              //check if user has a facebook user account already
              User.findOne({email:req.body.email})
                .populate('stats')
                .exec(function(err,user){
                if(err){
                  return next(err);
                }

                //no associated account, save new
                else if(!user){
                  var u = new User({
                    username: req.body.username,
                    name:req.body.name,
                    email: req.body.email,
                    password: password,
                    facebookId: null,
                    stats: null,
                    temp:false,
                    maxN:{
                      classic: 1,
                      relaxed: 1,
                      silent: 1,
                      advanced: 1
                    },
                    currentGame:[]
                  });

                  var leaderboard = new Leaderboard({user:u.username});
                  var userStats = new Stats({user:u._id,leaderboard:leaderboard._id});
                  userStats.save();
                  leaderboard.leaderboardBelongsToStats = userStats._id;
                  leaderboard.save();
                  u.stats = userStats._id;

                  if(req.session.user){
                    u.currentGame=req.session.user.currentGame;
                    u.stats = req.session.user.stats._id;
                    u.maxN = req.session.user.maxN;
                  }
                  else{
                    u.showTutorial = true;
                  }
                  saveUserRemoveAnonymous(req,res,u);
                  
                }

                //update user account (have facebook account already)
                else{ 
                  if(!user.password){
                    user.password = password;
                    user.save();
                  }

                  user.username = req.body.username;
                  if(req.session.user){
                    user.currentGame = req.session.user.currentGame;
                    user.stats.combineStats(req.session.user.stats);
                    user.combineMaxN(req.session.user.maxN);
                  }
                  console.log(user);
                  
                  saveUserRemoveAnonymous(req,res,user);

                }
              })
           });
        });


      }
    })

  });

 var saveUserRemoveAnonymous = function(req,res,user){
  user.validateSync();
  if(req.session.user){
    User.remove({_id:req.session.user._id},function(err,reqUser){
      if(!err){
        user.save(function(err,u){
          if(err){
            next(err);
          }
          else{
            console.log("success register")
            res.json({success:true,username:u.email,password:req.body.password})
          }
        });
      }
    })
  }
  else{
    user.save(function(err,u){
      if(err){
        next(err);
      }
      else{
        console.log("success register")
        res.json({success:true,username:u.email,password:req.body.password})
      }
    });
  }
    
 }

  router.get('/login/failure',function(req,res,next){
    res.status(401).json({success:false})
    //res.json({success:false,error:"login failure"})
  })

  //POST Login page
  router.post('/login', passport.authenticate('local',{failureRedirect:'/#/login/error'}), function(req,res,next){
    console.log(req.session.user); 
    req.session.user = req.user;
    Stats.findById(req.session.user.stats)
      .populate('leaderboard progress')
      .exec(function(err,stats){
        stats.leaderboard.user = req.session.user.username;
        stats.leaderboard.save();
        stats.progress.forEach(function(highScore){
          highScore.userName = req.session.user.username;
          highScore.save();
        })
      })


    //req.session.user = req.user;
    req.session.fullUser = true;
    console.log("login success")
    console.log(req.session.user)
    res.json({success:true});

	});

  // router.post('/login',passport.authenticate('local',{failureRedirect:'/#/login/error'}),function(req,res,next){
  //   res.json({success:true})
  // })

  
  // facebook
  router.get('/login/facebook',
    passport.authenticate('facebook', { scope:['email','user_friends']}), function(req,res,next){
      console.log("getting /login/facebook")
    });

  router.get('/login/facebook/callback',
    passport.authenticate('facebook',
      {failureRedirect: '/#/login/facebook/error',
      successRedirect:'/#/login/facebook/success'} ))
    // ,
    // function(req, res) {
    //   console.log(req,req.path,req.location);
    //   req.session.user = req.user;
    //   req.session.fullUser = true;

    //   console.log("success",req.session.user)

    //   res.json({success:true});
    // });

  router.get('gameOver/login/facebook',
    passport.authenticate('facebook', { scope:['email','user_friends']}), function(req,res,next){
      console.log("getting /login/facebook")
    });

  router.get('gameOver/login/facebook/callback',
    passport.authenticate('facebook',
      {failureRedirect: '/#/gameOver/login/facebookError',
      successRedirect:'/#/gameOver/login/facebook/success'} ))


  // reset user currentgame and logout (or err if !req.user)
  router.get('/logout', function(req, res,next) {
    console.log("logging out ", req.session.user)
    if(req.session.user){
      // var user = req.session.user;
      // user.currentGame=[];
      // user.save();

      req.logout();
      req.session.destroy(function(err){
        if(err){
          res.json({success:false,message:'err in destroy'})
        }
        else{
          res.json({success:true});
        }
      });


      // console.log("before save", req.session.user);
      // req.session.user.save(function(err,user){
      //   if(err){
      //     console.log(err);
      //   }
      //   else{
      //     console.log("after save", user);
      //     req.logout();
      //     req.session.destroy(function(err){
      //       if(err){
      //         res.json({success:false})
      //       }
      //       else{
      //         res.json({success:true});
      //       }
      //     });
      //   }
        
      // });
    }

    else{
      res.status(400).json({success:false,message:"not logged in"})
    }
  });

  return router;
}
