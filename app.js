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
  function(req,username, password, done) {
    // Find the user with the given username
    
    User.findOne({$or: [{username: username},{email:username}] }, function (err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (err) {
        console.error(err);
        return done(err);
      }
      console.log(user)

      if (!user) {
        //console.log(user);
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password,user.password,function(err,res){
        if(err){
          return done(err)
        }
        else if(!res){
          return done(null,false);
        }
        else{
          if(req.user){
            user.currentGame = req.user.currentGame;
            user.stats.combineStats(req.user.stats);
            user.combineMaxN(req.user.maxN);
            user.save();
            //User.findById(req.user._id).remove();
          }
          //user.currentGame = games.concat(user.currentGame);
          return done(null,user)
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
        console.log('no user');
        var user = registerFacebookUser(profile.id,email,username,req.user);
        user.save(function(err,user){
          return done(null,user)
        })
      }
      
    
      else if(req.user){
        console.log("req.user and user", user, user.stats)
        user.currentGame = req.user.currentGame;
        user.stats.combineStats(req.user.stats);
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
    });
}));



var registerFacebookUser = function(facebookId,email,username,currentUser){
    
    var user = new User({
      facebookId:facebookId,
      email:email,
      username:username,
      stats:null,
      temp:false,
      maxN:{
        classic:1,
        relaxed:1,
        silent:1,
        advanced:1
      },
      currentGame:[]
    });

    if(currentUser){
      user.stats = currentUser.stats;
      user.currentGame = currentUser.currentGame;
      user.maxN = currentUser.maxN;
      //User.findById(currentUser._id).remove();
    }
    else{
      var leaderboard = new Leaderboard({user:user._id});
      leaderboard.save();
      user.stats = new Stats({
        user:user._id,
        leaderboard: leaderboard._id
      });
    }
    
    return user;
}



app.use('/', auth(passport));
app.use('/',clientExpressFunctions);
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
