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
    if(userData.password !== userData.passwordConfirm){
      return false;
    }
    else if(!userData.password){
      return false;
    }
    else if(!userData.username){
      return false;
    }
    else if(!userData.email){
      return false;
    }
    else{
      return true;
    }
  };

  router.post('/register', function(req, res,next) {
    
    //didn't fill out form right
    if (!validateReq(req.body)) {
      console.log("validation failed")
        res.json({success:false, message:'invalid fields'});
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
        res.json({success:false, message:'user already exists'})
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
              User.findOne({email:req.body.email},function(err,user){
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

                  var leaderboard = new Leaderboard({user:u._id});
                  leaderboard.save();
                  var userStats = new Stats({user:u._id,leaderboard:leaderboard._id});
                  userStats.save();
                  u.stats = userStats._id;

                  if(req.user){
                    u.currentGame=req.user.currentGame;
                    u.stats = req.user.stats;
                    u.maxN = req.user.maxN;
                  }
                  u.save(function(err,u){
                    if(err){
                      next(err);
                    }
                    else{
                      console.log("success register")
                      res.json({success:true,username:u.email,password:req.body.password})
                    }
                  });
                }

                //update user account (have facebook account already)
                else{ 
                  if(!user.password){
                    user.password = password;
                    user.save();
                  }

                  user.username = req.body.username;
                  if(req.user){
                    user.currentGame = req.user.currentGame;
                    user.stats.combineStats(req.user.stats);
                    user.combineMaxN(req.user.maxN);
                  }
                  console.log(user);
                  user.save(function(err, user) {
                    if (err) {
                      next(err);
                    }
                    else{
                      console.log(user);
                      console.log("success register")
                      res.json({success:true,username:user.email,password:req.body.password})
                    }
                  })
                }
              })
           });
        });


      }
    })

  });


  //not in use right now
  var loginAfterRegister =function(username,password){
    axios.post('/login', {
      username: this.state.username,
      password: this.state.password
    }).then(function(response) {
      console.log("response")
      if (response.data.success) {
        res.json({success:true})
      } 
    }.bind(this))
    
  };

  

  router.get('/login/failure',function(req,res,next){
    //res.status(401).json({success:false})
    res.send({success:false,error:"login failure"})
  })

  // POST Login page
  router.post('/login', passport.authenticate('local',{failureRedirect: '/login/failure'}), function(req,res,next){
      
    req.session.user = req.user;
    req.session.fullUser = true;
      console.log("login success")
      console.log(req.user)
      res.json({success:true,user:req.user})
      console.log(req.user +" after json-ing");

	});

  
  // facebook
  router.get('/login/facebook',
    passport.authenticate('facebook', { scope:['email','user_friends']}), function(req,res,next){
      console.log("getting /login/facebook")
    });

  router.get('/login/facebook/callback',
    passport.authenticate('facebook',{failureRedirect: '/#/login'} ),
    function(req, res) {

      req.session.user = req.user;
      req.session.fullUser = true;

      console.log("success",req.user)
      res.redirect('/#/home');
    });


  // reset user currentgame and logout (or err if !req.user)
  router.get('/logout', function(req, res,next) {
    if(req.user){
      req.user.currentGame=[];
      req.user.save(function(err,user){
        req.logout();
        req.session.destroy();
        res.json({success:true});
      });
    }
    else{
      res.status(400).json({success:false})
    }
    
  });

  return router;
}
