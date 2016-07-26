var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

var User = require('../models/User');
var Stats = require('../models/Stats');

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

  router.post('/register', function(req, res,next) {
    // validation step

    if (!validateReq(req.body)) {
      console.log("validation failed")
      return next("user validation failed")
    }

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            // Store hash in your password DB. 
            var password = hash;
           
            var userStats = new Stats();
            userStats.save();



            var u = {
              username: req.body.username,
              email: req.body.email,
              password: password,
              facebookId: null,
              stats: userStats._id,
              temp:false,
              maxN:1,
              currentGame:[]
            };

            if(req.user){
              u.currentGame=req.user.currentGame
            }

            User.findOne({email:u.email},function(err,user){
              if(err){
                return next(err);
              }
              else if(user && !user.password){
                //user.username = u.username;
                user.password = u.password;
                user.currentGame = u.currentGame.concat(user.currentGame)
                console.log(user);
                user.save(function(err, user) {
                  if (err) {
                    return next(err);
                  }
                  else{
                    console.log(user);
                    res.json({success:true});
                  }
                })
              }
              else{
                console.log(u)
                user = new User({
                  username: u.username,
                  email: u.email,
                  password: u.password,
                  facebookId: u.facebookId,
                  stats: u.stats,
                  temp:u.temp,
                  maxN: {
                    classic:1,
                    relaxed:1,
                    silent:1,
                    advanced:1
                  },
                  currentGame:u.currentGame
                })
                user.save(function(err, user) {
                  if (err) {
                    console.log(err);
                    return next(err);
                    //res.status(500).redirect('/register');
                  }
                  else{
                    console.log(user);
                    res.json({success:true});
                  }
                });
              }
            })

        });
    });

    
    // .then(function(user){console.log(user.username)})
  });

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
            res.json({success:true,user:req.user})
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
    console.log(req.user, "before logged out")
    req.logout();
    console.log(req.user, "logged out")
    res.json({success:true});
    console.log(req.user)
  });

  return router;
}
