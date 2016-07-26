var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

var User = require('../models/User');
var Stats = require('../models/Stats');
var Leaderboard = require('../models/Leaderboard')

/* GET users listing. */
module.exports = function(passport) {

  // GET registration page
  router.get('/register', function(req, res) {
    res.render('register');
  });

  // POST registration page
  var validateReq = function(userData) {
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
    else{
      return true;
    }
  };

  router.post('/register', function(req, res) {
    // validation step

    if (!validateReq(req.body)) {
      console.log("validation failed")
        res.json({success:false, message:'user already exists'});
        return;
    }

    User.findOne({username:req.body.username}).exec(function(err,userWithSameName){
      if(err){
        res.json({success:false});
        return;
      }
      else if(!err && userWithSameName){
        console.log(userWithSameName, "register failed")
        res.json({success:false, message:'user already exists'})
        return;
      }
      else{

        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
              // Store hash in your password DB. 
              var password = hash;
              
              
              User.findOne({email:req.body.email},function(err,user){
                if(err){
                  return next(err);
                }
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
                else{ 
                  if(!user.password){
                    user.password = password;
                    user.save();
                  }

                // else{
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

    // bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash(req.body.password, salt, function(err, hash) {
    //         // Store hash in your password DB. 
    //         var password = hash;
            
            
    //         User.findOne({email:req.body.email},function(err,user){
    //           if(err){
    //             return next(err);
    //           }
    //           else if(!user){
    //             var u = new User({
    //               username: req.body.username,
    //               name:req.body.name,
    //               email: req.body.email,
    //               password: password,
    //               facebookId: null,
    //               stats: null,
    //               temp:false,
    //               maxN:{
    //                 classic: 1,
    //                 relaxed: 1,
    //                 silent: 1,
    //                 advanced: 1
    //               },
    //               currentGame:[]
    //             });

    //             var leaderboard = new Leaderboard({user:u._id});
    //             leaderboard.save();
    //             var userStats = new Stats({user:u._id,leaderboard:leaderboard._id});
    //             userStats.save();
    //             u.stats = userStats._id;

    //             if(req.user){
    //               u.currentGame=req.user.currentGame;
    //               u.stats = req.user.stats;
    //               u.maxN = req.user.maxN;
    //             }
    //             u.save(function(err,u){
    //               if(err){
    //                 next(err);
    //               }
    //               else{
    //                 res.json({success:true})
    //               }
    //             });
    //           }
    //           else{
    //             if(!user.password){
    //               user.password = password;
    //               user.save();
    //             }

    //           // else{
    //             user.username = req.body.username;
    //             if(req.user){
    //               user.currentGame = req.user.currentGame;
    //               user.stats.combineStats(req.user.stats);
    //               user.combineMaxN(req.user.maxN);
    //             }
    //             console.log(user);
    //             user.save(function(err, user) {
    //               if (err) {
    //                 next(err);
    //               }
    //               else{
    //                 console.log(user);
    //                 res.json({success:true})
    //               }
    //             })
    //           }

    //         })

    //     });
    // });
  });


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
    
    // .then(function(user){console.log(user.username)})
  };

  // GET Login page
  // router.get('/login', function(req, res) {
  //   if(req.user){
  //     res.redirect('/')
  //   }
  //   res.render('login');
  // });

  router.get('/login/failure',function(req,res,next){
    res.status(401).json({success:false})
  })

  // POST Login page
  router.post('/login', passport.authenticate('local'), function(req,res,next){
    // passport.authenticate('local',
		  //   function(err,user){
    //       if(err){
    //         console.log(err)
    //         res.json({success:false})
    //         return next(err);
    //       }
    //       else if(!user){
    //         console.log("no user")
    //         res.json({success:false})
    //       }
    //       else{
            console.log("login success")
            console.log(req.user)
            res.json({success:true})
        //   }
        // })
	});

  // facebook
  router.get('/login/facebook',
    passport.authenticate('facebook', { scope:['email','user_friends']}), function(req,res){
      console.log("getting /login/facebook")
    });

  router.get('/login/facebook/callback',
    passport.authenticate('facebook',{failureRedirect: '/#/login'} ),
    function(req, res) {

      console.log("success",req.user)
      res.redirect('/#/home');
    });


  // GET Logout page
  router.get('/logout', function(req, res) {
    req.user.currentGame=[];
    req.user.save();
    //console.log(req)
    //console.log(req.user, "before logged out")
    req.logout(function(err){
      
      if(err){
        console.log(err);
      }
      else{
        console.log("LOGGED OUT", req.user)
      }
    });
    console.log("before destroy: ",req.session);
    req.session.destroy();
    console.log("after destroy: ",req.session)
    res.json({success:true});
  });

  return router;
}
