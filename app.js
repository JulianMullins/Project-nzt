var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var FacebookStrategy = require('passport-facebook');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var routes = require('./server/index');
var auth = require('./server/auth');
var clientExpressFunctions = require('./server/clientExpressFunctions');
var highScores = require('./server/highScores');
var serverData = require('./server/serverData');
var gameOverUpdate = require('./server/gameOverUpdate');
var gameFunctions = require('./server/gameFunctions');
var statsFunctions = require('./server/taylorsDataFile');



var User = require('./models/User');
var Stats = require('./models/Stats');
var Leaderboard = require('./models/Leaderboard');
var TempUser = require('./models/TempUser');


var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//end of react stuff

//axios
var axios = require('axios');
axios.defaults.baseURL = process.env.url;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bundle', express.static(path.join(__dirname, 'bundle')));

//What Ruth put in
var connect = process.env.MONGODB_URI
mongoose.connect(connect);

//Copied passport stuff
app.use(session({
    secret: process.env.SECRET,
    // name: 'Catscoookie',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// passport strategy
passport.use(new LocalStrategy({
  passReqToCallback:true
  },
  function(req, username, password, done) {
    console.log("PASSPORT INITIALIZED ", req.user)

    //check if already logged in
    if(req.user && !req.user.temp){
      console.log("already logged in")
      return done(null,req.user);
    }

    //login tempuser
    TempUser.findById(username,function(err,tempUser){
      if(err){
        return done(err)
      }
      else if(tempUser){
        console.log("tempUser logged in")
        return done(null,tempUser);
      }
    })

    //log in real users
    console.log("PASSPORT DATA: ", username, password,req.body)
    
    // Find the user with the given username
    User.findOne({$or: [{username: username},{email:username}] }, function (err, user) {
      if (err) {
        console.error(err);
        return done(err);
      }
      console.log(user)
      
      if (!user) {
        //console.log(user);
        return done(null, false, { message: 'Incorrect username.' });
      }

      //check hashed passwords
      bcrypt.compare(password,user.password,function(err,response){
        if(err){
          return done(err)
        }
        else if(!response){
          return done(null,false,{message:"Incorrect password"});
        }
        else{
          console.log("passwords hashed")
          //check if tempUser exists
          if(req.user){
            console.log("already req.user")
            user.currentGame = req.user.currentGame;
            user.stats.combineStats(req.user.stats);
            user.combineMaxN(req.user.maxN);
            user.save(function(err,user){
              if(err){
                return done(err);
              }
              else{
                return done(null,user)
              }
            });
            //User.findById(req.user._id).remove();
          }
          //user.currentGame = games.concat(user.currentGame);
          
          //tempUser doesn't exist, just log in
          else{
            console.log("no req.user")
            console.log(done)
            console.log(user)
            req.login(user,function(err){
              console.log('req.logging in')
              if(!err){
                //return res.send({success:true})
              }
            })
            return done(null,user);
          }
        }
      })
    });


  }
));

// Facebook callback
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_clientID,
    clientSecret: process.env.FACEBOOK_clientSecret,
    //callbackURL: process.env.url+"/login/facebook/callback",
    callbackURL: process.env.url+"/login/facebook/callback",
    profileFields: ['id','email','name'],
    passReqToCallback:true
  },
  function(req,accessToken, refreshToken, profile, done) {
   console.log(profile)
   if(req.user && req.user.facebookId && !req.user.temp){
    return done(null,req.user);
   }
    User.findOne({$or:[{facebookId: profile.id},{email:profile._json.email}] })
      .populate('stats')
      .exec(function (err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      //console.log(profile.emails[0].value)


        var email = profile._json.email;
        var username = profile._json.first_name + ' '+profile._json.last_name;


      if (err) {
        console.error(err);
        return done(err);
      }

      else if (!user) {
        // req.user.update({
        //   facebookId:profile.id,
        //   email:email,
        //   name:username,
        //   temp:false
        // })
        if(req.user){
           req.user.facebookId = profile.id;
          req.user.email = email;
          req.user.name = username;
          req.user.temp = false;

          if(!req.user.username){
            req.user.username = username
          }
          req.user.save(function(err,reqUser){
            var user = req.user;
            req.logout();
            return done(null,user);
          })
        }
        else{

          var u = new User({
            facebookId:profile.id,
            email:email,
            name:username,
            temp:false,
            username:username,
            stats: null,
            temp:false,
            maxN:{
              classic: 1,
              relaxed: 1,
              silent: 1,
              advanced: 1
            },
            currentGame:[]
          })

          var leaderboard = new Leaderboard({user:u._id});
          leaderboard.save();
          var userStats = new Stats({user:u._id,leaderboard:leaderboard._id});
          userStats.save();
          u.stats = userStats._id;

          u.save(function(err,user){
            if(err){
              return done(err);
            }
            else{
              return done(null,user);
            }
          })
        }
      }

    
      else{
        if(req.user){
          console.log("req.user and user", user, user.stats)
          user.currentGame = req.user.currentGame;
          user.stats.combineStats(req.user.stats);
          user.combineMaxN(req.user.maxN);
          user.save();
        }

        if(!user.facebookId){
          console.log("no facebook id")
          user.facebookId = profile.id
          //console.log("facebook id added")
          user.save(function(err){
            if(err){done(err)}
          })
          return done(null, user);
        }
        // auth has has succeeded
        else{
          //console.log("success")
          console.log("returning done user")
          return done(null, user);
        }
      }
      
    });
}));



// var registerFacebookUser = function(facebookId,email,username,currentUser){

//     var user = new User({
//       facebookId:facebookId,
//       email:email,
//       name:username,
//       stats:null,
//       temp:false,
//       maxN:{
//         classic:1,
//         relaxed:1,
//         silent:1,
//         advanced:1
//       },
//       currentGame:[]
//     });

//     if(currentUser){
//       user.stats = currentUser.stats;
//       user.currentGame = currentUser.currentGame;
//       user.maxN = currentUser.maxN;
//       //User.findById(currentUser._id).remove();
//     }
//     else{
//       var leaderboard = new Leaderboard({user:user._id});
//       leaderboard.save();
//       var newStats = new Stats({
//         user:user._id,
//         leaderboard: leaderboard._id
//       });
//       newStats.save();
//       user.stats = newStats._id;
//     }

//     return user;
// }


app.use('/', auth(passport));
app.use('/',clientExpressFunctions);
app.use('/', routes);
app.use('/', highScores);

app.use('/', gameOverUpdate);
app.use('/',gameFunctions);
app.use('/',statsFunctions);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



// var port = process.env.PORT || 3000;
// server.listen(port, function() {
//   console.log('Started, listening on port ', port);
// });

module.exports = app
