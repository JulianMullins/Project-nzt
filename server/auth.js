var express = require('express');
var router = express.Router();
var User = require('../models/User');

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
      return next("user validation failed")
    }
    var u = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      facebookId: null,
      highScore:null
    });
    User.findOne({email:u.email},function(err,user){
      if(err){
        return next(err);
      }
      else if(user && !user.username){
        user.username = u.username;
        user.password = u.password;
        console.log(user);
        user.save(function(err, user) {
          if (err) {
            return next(err);
          }
          else{
            console.log(user);
            res.json({success:true,isLoggedIn:true});
          }
        })
      }
      else{
        console.log(u)
        u.save(function(err, user) {
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
    // .then(function(user){console.log(user.username)})
  });

  // GET Login page
  // router.get('/login', function(req, res) {
  //   if(req.user){
  //     res.redirect('/')
  //   }
  //   res.render('login');
  // });

  // POST Login page
  router.post('/login', function(req,res,next){
    passport.authenticate('local',
		    function(err,user){
          if(err){
            return next(err);
          }
          else if(!user){
            console.log("no user")
            res.json({success:false})
          }
          else{
            console.log("login success")
            res.json({success:true})
          }
        })
	});

  // facebook
  router.get('/login/facebook',
    passport.authenticate('facebook', { scope:['email','user_friends']}), function(req,res){});

  router.get('/login/facebook/callback',
    passport.authenticate('facebook',{failureRedirect: '/login'} ),
    function(req, res) {
      res.redirect('/')
    });


  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.json({'isLoggedIn':false})
  });

  return router;
}
