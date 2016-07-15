var express = require('express');
var router = express.Router();

/* GET users listing. */
module.exports = function(passport) {

  // GET registration page
  router.get('/register', function(req, res) {
    res.render('register');
  });

  // POST registration page
  var validateReq = function(userData) {
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
      return res.render('register', {
        error: "Passwords don't match."
      });
    }
    var u = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      wantsSpotify:true,
      facebookId: null,
      spotifyId:null
    });
    User.findOne({email:u.email},function(err,user){
      if(err){
        res.send(err)
        return;
      }
      else if(user && !user.username){
        user.username = u.username;
        user.password = u.password;
        console.log(user);
        user.save(function(err, user) {
          if (err) {
            res.status(500).redirect('/register');
          }
          else{
          console.log(user);
          res.redirect('/login');
          }
        })
      }
      else{
        console.log(u)
        u.save(function(err, user) {
          if (err) {
            console.log(err);
            res.status(500).redirect('/register');
          }
          else{
            console.log(user);
            res.redirect('/login');
          }
        });
      }
    })
  });

  // GET Login page
  router.get('/login', function(req, res) {
    if(req.user){
      res.redirect('/')
    }
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local', {
		    failureRedirect: '/login',
		    successRedirect: '/'
		})
	);

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  router.get('/login/facebook',
  passport.authenticate('facebook', { scope:['email','user_friends']}), function(req,res){});

  router.get('/login/facebook/callback',
  passport.authenticate('facebook',{
    successRedirect:'/',
    failureRedirect: '/login'} ));


}
module.exports=router;
