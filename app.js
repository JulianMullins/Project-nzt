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
var back = require('express-back');

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
    saveUninitialized: false
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
    if(req.user && req.session.fullUser){
      console.log("already logged in")
      return done(null,req.user);
    }

    //login tempuser
      //don't need to now since data's in session, not user    

    //log in real users
    console.log("PASSPORT DATA: ", username, password,req.body)
    
    // Find the user with the given username
    User.findOne({$or: [{username: username},{email:username}] })
      .populate('stats')
      .exec(function (err, user) {
      if (err) {
        console.error(err);
        return done(err);
      }
      
      if (!user) {
        //console.log(user);
        return done('user does not exist', false, { message: 'Incorrect username.' });
      }

      console.log(user)
      user.currentGame = [];

      //check hashed passwords
      bcrypt.compare(password,user.password,function(err,response){
        if(err){
          return done(err)
        }
        else if(!response){
          return done('incorrect password',false,{message:"Incorrect password"});
        }
        else{
          console.log("passwords hashed")
          //check if tempUser exists
          if(req.session.user){
            console.log("already req.session.user")
            console.log(user.stats);
            console.log(req.session.user);
            
            Stats.findById(req.session.user.stats,function(err,sessionStats){
              console.log(sessionStats)
              user.currentGame = req.session.user.currentGame;
              user.stats.combineStats(sessionStats);
              user.combineMaxN(req.session.user.maxN);
              console.log("about to combine leaderboards")
              combineLeaderboards(user.stats.leaderboard,sessionStats.leaderboard,
                req.session.user._id,req.session.user.username,
                   function(leaderboard){
                    
                    return combineLeaderboardsCallback(req,req.session.user,user,user.stats,leaderboard,done);
                      
                  })
              
            });


            //User.findById(req.user._id).remove();
          }
          //user.currentGame = games.concat(user.currentGame);
          
          //tempUser doesn't exist, just log in
          else{
            console.log("no req.session.user")
            return done(null,user);
          }
        }
      })
    });
  }
));

var combineLeaderboardsCallback=function(req,oldUser,newUser,newUserStats,leaderboard,done){
  console.log("leaderboards combined")
  leaderboard.save(function(err,leaderboard){
    newUserStats.save(function(err,stats){
      console.log("combine leaderboard callback")
      User.remove({_id:oldUser._id},function(err,oldUser){
        if(!err){
          newUser.save(function(err,user){
            if(err){
              return done(err);
            }
            else{
              req.session.user = user;
              return done(null,user)
            }
          });
        }
      })
      
    })
  })
}

var combineLeaderboards = function(leaderboard1,leaderboard2,userId, username, callback){
  console.log("combining leaderboards in combineLeaderboards")
  console.log(leaderboard1,leaderboard2)
  Leaderboard.findById(leaderboard1)
    .populate('scores')
    .exec(function(err,leaderboard1){
      console.log("leaderboard1 found")
    Leaderboard.findById(leaderboard2)
      .populate('scores')
      .exec(function(err,leaderboard2){
        if(err){
          console.log(err)
        }
        else{
          console.log("leaderboard2: ",leaderboard2)
        }

        console.log(leaderboard1,leaderboard2)
        leaderboard2.userId = userId;
        
        if(leaderboard2.scores.length==0){
          return callback(leaderboard1);
        }
        else{
          leaderboard1.scores = leaderboard1.mergeScoresArrays(leaderboard1.scores,leaderboard2.scores);
          leaderboard1.save(function(err,leaderboard){
            return callback(leaderboard)
          })
        }
        
    })
  })
}


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

    if(req.user && req.user.facebookId && req.session.fullUser){
      return done(null,req.user);
    }
   // if(req.user && req.user.facebookId && !req.user.temp){
   //  return done(null,req.user);
   // }
    User.findOne({$or:[{facebookId: profile.id},{email:profile._json.email}] })
      .populate('stats')
      .exec(function (err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      //console.log(profile.emails[0].value)


        // var email = profile._json.email;
        // var name = profile._json.first_name + ' '+profile._json.last_name;
        // var username = profile._json.first_name[0]+profile._json.last_name;
        // username.toLowerCase();



      if (err) {
        console.error(err);
        return done(err);
      }

      else if (!user) {
       
        var email = profile._json.email;
        var name = profile._json.first_name + ' '+profile._json.last_name;
        var username = profile._json.first_name[0]+profile._json.last_name;
        username = username.toLowerCase();
        
        User.find({username: {$regex: username}},function(err,users){
          if(users){
            username+=(users.length+1)
          }
        }).exec(function(err,users){ 

        if(req.session.user && !req.session.fullUser){

          var newUser = new User({
            name:name,
            email:email,
            facebookId: profile.id,
            username:username,
            maxN: req.session.user.maxN,
            stats: req.session.user.stats,
            temp:false,
            currentGame: req.session.user.currentGame
          })

          User.remove({_id:req.session.user._id},function(err,reqUser){
            if(!err){
              newUser.save(function(err,user){
                req.session.user = user;
                req.session.fullUser = true;
                return done(null,user);
              })
            }
          })
          
          
        }
        else{

          var u = new User({
            facebookId:profile.id,
            email:email,
            name:name,
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
            currentGame:[],
            showTutorial:false
          })

          //removed userId
          var leaderboard = new Leaderboard({user:username});
          var userStats = new Stats({statsUser:u._id,leaderboard:leaderboard._id});
          userStats.save();
          leaderboard.leaderboardBelongsToStats = userStats._id;
          leaderboard.save();
          u.stats = userStats._id;

          u.save(function(err,user){
            if(err){
              return done(err);
            }
            else{
              req.session.user = user;
              req.session.fullUser = true;
              return done(null,user);
            }
          })
        }
      })
      }

    
      else{
        if(req.session.user){
          console.log("req.session.user and user", user, user.stats)
          user.currentGame = req.session.user.currentGame;
          if(!user.facebookId){
            console.log("no facebook id")
            user.facebookId = profile.id;
            user.name = profile._json.first_name + ' '+profile._json.last_name;
          }
          Stats.findById(req.session.user.stats,function(err,sessionStats){
            user.stats.combineStats(sessionStats);
            sessionStats.remove(function(err,sessionStats){
              if(!err){
                user.combineMaxN(req.session.user.maxN);
                User.remove({_id:req.session.user._id},function(err){
                  
                  user.save(function(err){
                    if(err){
                      done(err)
                    }
                    else{
                      req.session.user = user;
                      req.session.fullUser = true;
                      return done(null, user);
                    }
                  })
                })
                
              }
            })
              
          });

        }
        else{
          if(!user.facebookId){
            console.log("no facebook id")
            user.facebookId = profile.id
            //console.log("facebook id added")
            user.save(function(err){
              if(err){
                done(err)
              }
              else{
                req.session.user = user;
                req.session.fullUser = true;
                return done(null, user);
              }
            })
          }
          // auth has has succeeded
          else{
            //console.log("success")
            console.log("returning done user")
            req.session.user = user;
            req.session.fullUser = true;
            return done(null, user);
          }
        }
      }
      
    
    });
}));




app.use('/', auth(passport));
app.use('/', clientExpressFunctions);
app.use('/', routes);
app.use('/', highScores);

app.use('/', gameOverUpdate);
app.use('/', gameFunctions);
app.use('/', statsFunctions);


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
    // res.status(err.status || 500);

    res.json({
      success:false,
      message:err
    })

  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  // res.render('error', {
  //   message: err.message,
  //   error: {}
  // });
  return res.json({
    success:false,
    error:'ERROR IN APP.USE',
    message:err.message
  })
});



// var port = process.env.PORT || 3000;
// server.listen(port, function() {
//   console.log('Started, listening on port ', port);
// });

module.exports = app
