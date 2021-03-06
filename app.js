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
var combineStats = require('./server/auth').combineStats;
var auth = require('./server/auth').auth;
var clientExpressFunctions = require('./server/clientExpressFunctions');
var leaderboardFunctions = require('./server/leaderboardFunctions');
var serverData = require('./server/serverData');
var gameOverUpdate = require('./server/gameOverUpdate');
var gameFunctions = require('./server/gameFunctions');
var statsFunctions = require('./server/statsFunctions');


var User = require('./models/User');
var Stats = require('./models/Stats');
var HighScore = require('./models/HighScore');
var Leaderboard = require('./models/Leaderboard');
var OverallLeaderboard = require('./models/OverallLeaderboard');
var FriendsLeaderboard = require('./models/FriendsLeaderboard');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//end of react stuff

//Facebook stuff
var FB = require('facebook-node');

var Facebook = require('facebook-node-sdk');
var facebook = new Facebook({
  appId: process.env.FACEBOOK_clientID,
  secret: process.env.FACEBOOK_clientSecret
});

//axios
var axios = require('axios');
axios.defaults.baseURL = process.env.url;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bundle', express.static(path.join(__dirname, 'bundle')));

//What Ruth put in
var connect = process.env.MONGODB_URI
mongoose.connect(connect);

//Copied passport stuff
app.use(session({
  secret: process.env.SECRET,
  // name: 'Catscoookie',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
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



// var newOL = new OverallLeaderboard();
// newOL.save(function(err,ol){
//   console.log(ol._id)
// });


// HighScore.find().exec(function(err,highScores){
//   highScores.forEach(function(score){
//     var toSave = false;
//     for(var i=0;i<score.reactionTimes.length;i++){
//       if(score.reactionTimes[i]<0){
//         score.reactionTimes.splice(i,1);
//         toSave = true;
//         i--;
//       }
//     }
//     if(toSave){

//       if(!score.userName && score.tempUser){
//         score.userName='Anonymous'
//       }
//           console.log(score.reactionTimes)
//       score.save(function(err,score){
//         if(err || !score){
//           console.log("PANICKING: "+err,score)
//         }
//         else if(!score.reactionTimes){
//           console.log("PANIC: "+ score)
//         }
//         else{
//           console.log("score saved: "+score.reactionTimes)
//         }
//       })
//     }
//   })
// })

// HighScore.find({userName:null}).exec(function(err,scores){
//   console.log(scores)
// })

// OverallLeaderboard.findOne().populate('scores')
//   .exec(function(err,leaderboard){
  // leaderboard.scores.forEach(function(score){
  //   if(score.userName == 'Anonymous'){
  //     HighScore.findById(score._id).exec(function(err,highScore){
  //       console.log(highScore)
  //       if(highScore.userName!='Anonymous'){
  //         console.log(score,highScore)
  //       }
  //     })
  //   }
  // })
  // HighScore.find().exec(function(err,highscores){
  //   highscores.forEach(function(highScore){
  //     var found = false;
  //     for(var i=0;i<leaderboard.scores.length;i++){
  //       if(highScore._id.equals(leaderboard.scores[i]._id)){
  //         console.log("FOUND ONE")
  //         found=true;
  //       }
  //     }
      
  //     if(!found){
  //       console.log(highScore)
  //       leaderboard.scores.push(highScore)
  //     }

  //   })

  // }).then(
  // HighScore.find().exec(function(err,highscores){
  //   highscores.forEach(function(highScore){
  //     var found = false;
  //     for(var i=0;i<leaderboard.scores.length;i++){
  //       if(highScore._id.equals(leaderboard.scores[i]._id)){
  //         console.log("FOUND ONE")
  //         found=true;
  //       }
  //     }
      
  //     if(!found){
  //       console.log(highScore)
  //       leaderboard.scores.push(highScore)
  //     }

  //   })
    
  // })
  // ).then(function(){
  // console.log("ABOUT TO SAVE");
  // leaderboard.save(function(err,ol){
  //   console.log("err: "+err, "ol: "+err)
  // })
  // })
  //console.log("done")
//})

// User.find({username:'Anonymous'}).exec(function(err,users){
//   users.forEach(function(user){
//     if(user.currentGame.length>3){
//       console.log("clearing games")
//       user.currentGame = [];
//       user.save();
//     }
//   })
// })

// HighScore.find().exec(function(err,scores){
//   scores.forEach(function(score){   
//     console.log("checking score")
//     // if(score.score<=0){
//     //   score.remove(function(err){console.log("gone")})
//     // }
//     if(score.userName != 'Anonymous' && score.tempUser){
//       console.log(score.userName, score.tempUser)
//       score.tempUser = false;
//       score.save();
//     }
//   })
// })



// OverallLeaderboard.findById(serverData.serverLeaderboard)
//   .exec(function(err,leaderboard){
//     var scoreArray = [];
//     HighScore.find().exec(function(err,scores){
//       scores.forEach(function(score){
//         scoreArray.push(score._id)
//       })
//     }).then(function(){

//     leaderboard.scores = scoreArray;
//     leaderboard.save(function(err,leaderboard){
//       if(err){
//         console.log(err)
//       }
//       else{
//         console.log(leaderboard.scores)
//       }
//     })
//   })

// })

// Stats.find().populate('statsUser progress').exec(function(err,stats){
//   stats.forEach(function(stats){

//     // if(!stats.statsUser.temp){
//     //   stats.progress.forEach(function(score){
//     //     if(score.userName == 'Anonymous'){
//     //       score.userName = stats.statsUser.username;
//     //       score.save(function(err,score){console.log("SAVED ",score)})
//     //     }
//     //   })
//     // }

//     // // if(!stats.statsUser){
//     // //   console.log("ANGST ",stats)
//     // // }
//     // if(!stats.statsUser.facebookId){
//     //   //console.log('PROBLEM HERE',stats)
//     //   // Stats.remove({_id:stats._id},function(err){
//     //   //   console.log("done")
//     //   // })
//     //   return;
//     // }
//     // console.log("found fb user",stats)
//     stats.progress.forEach(function(score){
//       if(!score.FBname || score.FBname!==stats.statsUser.name){
//         console.log("adding name")
//         score.FBname = stats.statsUser.name;
//         score.save(function(err,score){console.log(score)});
//       }
//     })
//     console.log("all done")
//   })
  
// })

// HighScore.find().exec(function(err,scores){
//   scores.forEach(function(score){
//     if (score.tempUser && score.userName!='Anonymous'){
//       //console.log(score);

//       User.findOne({username: score.userName}).exec(function(err,user){
//         if(err){
//           console.log(err,user)
//         }
//         //console.log(user)
//         if(!user){
//           console.log("no user")
//           HighScore.remove({_id:score._id},function(err){
//             console.log("done")
//           })
//           //console.log(score)
//         }
//         else if(user.facebookId){
//           score.FBname = user.name;
//           score.tempUser = false;
//           score.save(function(err,score){
//            console.log("has FB: " +score)
//           })
//         }
//       })

//     }
//   })
//   console.log("ALL DONE")
// })


// passport strategy
passport.use(new LocalStrategy({
    passReqToCallback: true
  },
  function(req, username, password, done) {
    console.log("PASSPORT INITIALIZED ", req.user,req.body,username,password)

    //check if already logged in
    if (req.user && req.session.fullUser && req.session.user.facebookId) {
      console.log("already logged in")
      return done(null, req.user);
    }

    //check if all data is there
    if(!username || !password || username.length<4 || password.length<4){
      console.log("Please enter proper credentials")
      return done("Please enter proper credentials");
    }


    //log in real users
    console.log("PASSPORT DATA: ", username, password, req.body)

    // Find the user with the given username
    User.findOne({
        $or: [{
          username: username
        }, {
          email: username
        }]
      })
      .populate('stats')
      .exec(function(err, user) {
        if (err) {
          console.error(err);
          return done(err);
        }

        if (!user) {
          //console.log(user);
          return done('User does not exist', false, {
            message: 'Incorrect username.'
          });
        }

        console.log(user)
        user.currentGame = [];

        //check hashed passwords
        bcrypt.compare(password, user.password, function(err, response) {
          if (err) {
            return done('Problem comparing passwords',err)
          } else if (!response) {
            return done('Incorrect password', false, {
              message: "Incorrect password"
            });
          } else {
            console.log("passwords hashed")
              //check if tempUser exists
            if (req.session.user) {
              console.log("already req.session.user")
              console.log(user.stats);
              console.log(req.session.user);

              Stats.findById(req.session.user.stats, function(err, sessionStats) {
                console.log(sessionStats)
                user.currentGame = req.session.user.currentGame;
                combineStats(user.stats._id,sessionStats._id);
                user.combineMaxN(req.session.user.maxN);
                console.log("about to combine leaderboards")
                combineLeaderboards(user.stats.leaderboard, sessionStats.leaderboard,
                  req.session.user._id, req.session.user.username,
                  function(leaderboard) {

                    return combineLeaderboardsCallback(req, req.session.user, user, user.stats, leaderboard, done);

                  })

              });


              //User.findById(req.user._id).remove();
            }
            //user.currentGame = games.concat(user.currentGame);

            //tempUser doesn't exist, just log in
            else {
              console.log("no req.session.user")
              return done(null, user);
            }
          }
        })
      });
  }
));

var combineLeaderboardsCallback = function(req, oldUser, newUser, newUserStats, leaderboard, done) {
  console.log("leaderboards combined")
  leaderboard.save(function(err, leaderboard) {
    newUserStats.save(function(err, stats) {
      console.log("combine leaderboard callback")
      User.remove({
        _id: oldUser._id
      }, function(err, oldUser) {
        if (!err) {
          newUser.save(function(err, user) {
            if (err) {
              return done(err);
            } else {
              req.session.user = user;
              return done(null, user)
            }
          });
        }
      })

    })
  })
}

var combineLeaderboards = function(leaderboard1, leaderboard2, userId, username, callback) {
  console.log("combining leaderboards in combineLeaderboards")
  console.log(leaderboard1, leaderboard2)
  Leaderboard.findById(leaderboard1)
    .populate('scores')
    .exec(function(err, leaderboard1) {
      console.log("leaderboard1 found")
      Leaderboard.findById(leaderboard2)
        .populate('scores')
        .exec(function(err, leaderboard2) {
          if (err) {
            console.log(err)
          } else {
            console.log("leaderboard2: ", leaderboard2)
          }

          console.log(leaderboard1, leaderboard2)
          leaderboard2.userId = userId;

          if (leaderboard2.scores.length == 0) {
            return callback(leaderboard1);
          } else {
            leaderboard1.scores = leaderboard1.mergeScoresArrays(leaderboard1.scores, leaderboard2.scores);
            leaderboard1.save(function(err, leaderboard) {
              return callback(leaderboard)
            })
          }

        })
    })
}


var endFBPassportFunction = function(req,user,done){
  console.log("UPDATE FL USER: ", user);
  updateFriendsLeaderboards(req, user.facebookId,user.friendsLeaderboard,user._id);
  req.session.user = user;
  req.session.fullUser = true;
  //req.session.fbAccessToken = FB.getAccessToken();
  return done(null, user);

}


var updateFriendsLeaderboards = function(req,facebookId,friendsLeaderboardId,userId){
  console.log("IN UPDATE FUNCTION: ",friendsLeaderboardId)
  facebook.api( '/'+facebookId+'/friends',
      
      function(err,data){
        if(err){
          console.log(err);
        }
        else{

          console.log(friendsLeaderboardId);

          console.log(data.data)
          var friendIds = [];
          for(var i=0;i<data.data.length;i++){
            friendIds.push(data.data[i].id)
          }
          console.log(friendIds);
          FriendsLeaderboard.findById(friendsLeaderboardId)
            .exec(function(err,friendsLeaderboard){
              console.log(err,friendsLeaderboard);
              if(friendsLeaderboard.friends.length===friendIds.length){
                return;
              }


              friendsLeaderboard.friends=[userId];

              for(var i=0;i<friendIds.length;i++){
                User.findOne({facebookId:friendIds[i]},function(err,friend){
                  if(err || !friend){
                    console.log('SOMETHING IS WRONG')
                  }
                  else{
                    console.log(friend)
                    friendsLeaderboard.friends.push(friend._id)
                    friendsLeaderboard.save(function(err,fl){
                      console.log("SAVED FL",err,fl)
                    })
                  }
                })
              }

              // console.log(user.friendsLeaderboard)

              // user.friendsLeaderboard.save(function(err,user){
              //   console.log('ALL DONE HERE', err,user)
              // });

            })
        }
      }
    )
}



// Facebook callback
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_clientID,
    clientSecret: process.env.FACEBOOK_clientSecret,
    callbackURL: process.env.url + "/api/login/facebook/callback",
    profileFields: ['id', 'email', 'name'],
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    console.log(profile)

    if (req.user && req.user.facebookId && req.session.fullUser) {
      return done(null, req.user);
    }

    User.findOne({
        $or: [{
          facebookId: profile.id
        }, {
          email: profile._json.email
        }]
      })
      .populate('stats')
      .exec(function(err, user) {

        if (err) {
          console.error(err);
          return done(err);

      //create new user
        } else if (!user) {
          console.log("no preexisting user")
          var email = profile._json.email;
          var name = profile._json.first_name + ' ' + profile._json.last_name;
          var username = profile._json.first_name[0] + profile._json.last_name;
          username = username.toLowerCase();

          User.find({
            username: {
              $regex: username
            }
          }, function(err, users) {
            if(err){
              console.log(err);
              return done(err)
            }
            if (users) {
              username += (users.length + 1)
            }
          }).populate('stats')
          .exec(function(err, users) {
            if(err){
              console.log(err);
              return done(err)
            }
            if (req.session.user && !req.session.fullUser) {
              var newUser = new User({
                name: name,
                email: email,
                facebookId: profile.id,
                username: username,
                maxN: req.session.user.maxN,
                stats: req.session.user.stats,
                temp: false,
                currentGame: req.session.user.currentGame
              })

              var friendsLeaderboard = new FriendsLeaderboard({FLuser:newUser._id,friends:[newUser._id]});
              friendsLeaderboard.save();

              newUser.friendsLeaderboard = friendsLeaderboard._id;

              User.remove({
                _id: req.session.user._id
              }, function(err, reqUser) {
                if (!err) {
                  newUser.save(function(err, user) {
                    
                    return endFBPassportFunction(req,reqUser,done);

                  })
                }            
              })
            } else {
              var u = new User({
                facebookId: profile.id,
                email: email,
                name: name,
                temp: false,
                username: username,
                stats: null,
                temp: false,
                maxN: {
                  classic: 1,
                  relaxed: 1,
                  silent: 1,
                  advanced: 1
                },
                currentGame: [],
                showTutorial: false
              })

              //removed userId
              var leaderboard = new Leaderboard({
                user: username
              });
              var userStats = new Stats({
                statsUser: u._id,
                leaderboard: leaderboard._id
              });
              userStats.save();
              leaderboard.leaderboardBelongsToStats = userStats._id;
              leaderboard.save();

              var friendsLeaderboard = new FriendsLeaderboard({FLuser:newUser._id,friends:[newUser._id]});
              friendsLeaderboard.save();

              newUser.friendsLeaderboard = friendsLeaderboard._id;

              u.stats = userStats._id;

              u.save(function(err, user) {
                if (err) {
                  return done(err);
                } else {

                  return endFBPassportFunction(req,user,done);

                }
              })
            }
          })
        } 


    //user already exists; update/login
        else {
          console.log("USER EXISTS",user,user.friendsLeaderboard)

          if(!user.friendsLeaderboard){
            console.log("NO FL")
            var friendsLeaderboard = new FriendsLeaderboard({FLuser:user._id,friends:[user._id]});
            friendsLeaderboard.save(function(err,fl){console.log("fl saved")});
            user.friendsLeaderboard = friendsLeaderboard._id;
          }


          if (req.session.user) {
            console.log("req.session.user and user", user, user.stats)
            user.currentGame = req.session.user.currentGame;
            if (!user.facebookId) {
              console.log("no facebook id")
              user.facebookId = profile.id;
              user.name = profile._json.first_name + ' ' + profile._json.last_name;
            }
            Stats.findById(req.session.user.stats, function(err, sessionStats) {
              if(err || !sessionStats){
                console.log(err);
                return
              }
              console.log(user,user.stats,sessionStats)
              combineStats(user.stats._id,sessionStats._id);
              Stats.remove({_id:sessionStats._id}, function(err, sessionStats) {
                if (!err) {
                  user.combineMaxN(req.session.user.maxN);
                  User.remove({
                    _id: req.session.user._id
                  }, function(err) {

                    user.save(function(err,user) {
                      if (err) {
                        done(err)
                      } else {
                        
                        console.log("AFTER SAVED", user)
                        return endFBPassportFunction(req,user,done);

                      }
                    })
                  })
                }
              })

            });

          } else {
            user.currentGame = [];
            if (!user.facebookId) {
              console.log("no facebook id")
              user.facebookId = profile.id
                //console.log("facebook id added")
            }
            user.save(function(err,user) {
                if (err) {
                  done(err)
                } else {
                  
                  console.log("SAVED USER: ",user)
                  return endFBPassportFunction(req,user,done);

                }
              })
              // auth has has succeeded
              // else{
              //   //console.log("success")
              //   console.log("returning done user")
              //   req.session.user = user;
              //   req.session.fullUser = true;
              //   return done(null, user);
              // }
          }
        }
      });
  }));






app.use('/api/', auth(passport));
app.use('/api/', clientExpressFunctions);
app.use('/api/', leaderboardFunctions);
app.use('/api/', gameOverUpdate);
app.use('/api/', statsFunctions);
app.use('/api/', gameFunctions);


app.use('/', routes);
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
    console.log(err);
    res.json({
      success: false,
      message: err
    })

  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  //res.status(err.status || 500);
  // res.render('error', {
  //   message: err.message,
  //   error: {}
  // });
  res.json({
    success: false,
    message: err
  })
});

module.exports = app
