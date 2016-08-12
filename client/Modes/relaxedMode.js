var React = require('react');
var GameTimer = require('./gameTimer');
var StartOverlay = require('./gameStartOverlay');
var axios = require('axios');
axios.defaults.baseURL = process.env.url;
import {Link} from 'react-router'

var endGameFunction = require('./serverFunctions').endGameFunction;
var startGameFunction = require('./serverFunctions').startGameFunction;

//COLLECTION OF GLOBAL VARIABLES TO MAKE EVERYONES LIFE EASIER
//create global variable for reaction counter
//var reactionStart;
//global variable for keeping reaction times
//note: all reaction times for correct hits stored as array for stats (max,min,avg)
// var reactionTimes = [];
// //global variable for game score (saved once time runs out)
var iterations;
// var fullScore = 0;
// var currentScore;
// var matchCount = 0; //total matches in game
// var matchHit = 0; ///ones user gets

var RelaxedMode = React.createClass({
  getInitialState: function() {
    console.log("getting initial state")
    return {
      style: [
        standardStyle,
        standardStyle,
        standardStyle,
        standardStyle,
        standardStyle,
        standardStyle,
        standardStyle,
        standardStyle,
        standardStyle
      ],
      positionMatch: false,
      score: 0,
      keepScore: false,
      alert: " ",
      overlay: true,
      initialTimer: 3,
      N: parseInt(this.props.params.n),
      alreadyPressed: false,
      posStyle: noStyle,
      tempUser: true,
      gameId: null,
      mode: 'relaxed',
      penalty: 0,
      positivePoints: 0,
      fullScore: 0,
      matchCount: 0,
      matchHit: 0,
      reactionTimes: [],
      currentScore: null,
      scoreAlert: '',
      scoreUpdate: ''
    }
  },
  componentDidMount: function() {

    startGameFunction(this.state.mode, this.state.N, function(err, obj) {
      if (err) {
        this.props.history.push('/levels/' + this.state.mode + '/unauthorized');
        return;
      }
      console.log(obj)
      this.setState({
        tempUser: obj.tempUser,
        gameId: obj.gameId,
        modeMultiplier: obj.modeMultiplier,
        penalty: obj.penalty * obj.modeMultiplier,
        positivePoints: obj.positivePoints * obj.modeMultiplier
      })
      console.log("positivePoints: " + this.state.positivePoints)
    }.bind(this));
    console.log("component mounted")
  },
  componentWillUnmount: function() {
    clearInterval(iterations);
  },
  enableKeys: function() {
    window.onkeyup = function(e) {
      if (e.keyCode == 38) {
        this.posMatch();
      }
    }.bind(this);
  },
  startGame: function() {

    axios.get('/api/isUser').then(function(response) {
      console.log(response.data)
    })

    this.setState({overlay: false});
    this.position();
    this.enableKeys();
  },
  match() {
    this.setState({
      currentScore: (((2000 - (this.state.reactionStop-this.state.reactionStart)) / 1000) * this.state.positivePoints).toFixed(2)
    });
    this.setState({
      reactionTimes: this.state.reactionTimes.concat([this.state.reactionStop-this.state.reactionStart]),
      fullScore: this.state.fullScore + parseFloat(this.state.currentScore),
      matchCount: this.state.matchCount + 1,
      matchHit: this.state.matchHit + 1,
      score: parseInt(this.state.fullScore),
      //alert: "Good job",
      posStyle: noStyle,
      //scoreAlert: 'scoreAlertPositive',
      scoreUpdate: 'scoreUpdate scoreUpdatePos',
      currentScore: "+" + parseInt(this.state.currentScore)
    });
    // console.log("currentScore: " + this.state.currentScore, "fullScore: " + this.state.fullScore)
    // setTimeout(function() {
    //   console.log('been 800ms')
    //   this.setState({alert: ' ', currentScore: null});
    // }.bind(this), 800);
  },
  incorrect(alert) {
    if ((this.state.fullScore - this.state.penalty) >= 0) {
      this.setState({
        currentScore: -this.state.penalty
      })
    } else {
      this.setState({
        currentScore: -this.state.fullScore
      })
    }
    this.setState({
      //matchHit: this.state.matchHit - 1,
      matchCount: this.state.matchCount + 1,
      fullScore: this.state.fullScore + this.state.currentScore,
      posStyle: noStyle,
      //alert: alert,
      //scoreAlert: 'scoreAlertNegative',
      scoreUpdate: 'scoreUpdate scoreUpdateNeg',
      currentScore: parseInt(this.state.currentScore),

    });
    // setTimeout(function() {
    //   console.log('been 800ms')
    //   this.setState({alert: ' ', currentScore: null, scoreAlert: ''});
    // }.bind(this), 800);
  },
  position: function() {
    var posQueue = [];
    var timeTilPosMatch = parseInt((Math.random() * 5) + this.state.N);
    var timeKeeper = 44;

    iterations = setInterval(function() {
      timeKeeper--;


      if(!this.state.alreadyPressed && this.state.posMatch){
        this.incorrect();
        this.setState({
          positionButton:'youFailed'
        })
      }

      // if (this.state.keepScore && this.state.posMatch) {
      //   this.incorrect('Missed a match');
      // }

      this.setState({
        pressed: false,
        keepScore: false,
        posMatch: false,
        alreadyPressed: false,
        posStyle: noStyle});

      setTimeout(function() {
        this.setState({
          scoreUpdate:'',
          positionButton:'',
          currentScore:null
        })
        // console.log('been 800ms')
        // this.setState({alert: ' ',currentScore:null});
      }.bind(this), 800);
      //start reaction time counter with flash
      this.setState({reactionStart : Date.now()})

      if (timeTilPosMatch > 0) {
        // pick a non-matching next number while interval is not 0
        var nextPos = parseInt(Math.random() * 9);
        while (nextPos == posQueue[0]) {
          nextPos = parseInt(Math.random() * 9);
        }

        // resize array to N
        posQueue.push(nextPos);
        if (posQueue.length > this.state.N) {
          posQueue.splice(0, 1);
        }

        // set color for 800
        this.state.style[nextPos] = newStyle;
        this.setState({style: this.state.style});
        setTimeout(function() {
          this.state.style[nextPos] = standardStyle;
          this.setState({style: this.state.style});
        }.bind(this), 800);

        // lower interval
        timeTilPosMatch--;
      } else {
        // pick new interval
        timeTilPosMatch = parseInt((Math.random() * 5) + 2);

        // guaranteed match
        var nextPos = posQueue[0];
        posQueue.push(nextPos);
        posQueue.splice(0, 1);

        // set color for 800
        this.state.style[nextPos] = newStyle;
        this.setState({style: this.state.style, posMatch: true, keepScore: true});
        ///start reaction time as soon as blink starts
        setTimeout(function() {
          this.state.style[nextPos] = standardStyle;
          this.setState({style: this.state.style});
        }.bind(this), 800);
      }

      //////////////////////////////////////
      //////////////////////////////////////
      //////////////////////////////////////

      // Game end

      if (timeKeeper === 0) {


        //give gameScore variable the final score
        clearInterval(iterations);
        console.log(this.state.fullScore)
        var accuracy = this.state.matchHit / this.state.matchCount;
        console.log(accuracy, 'accuracy')

        endGameFunction(this.state.fullScore, this.state.reactionTimes, this.state.gameId, accuracy, function(data) {
          if (data.success) {
            this.props.history.push('/gameOver')
          } else {
            this.props.history.push('/error/' + encodeURIComponent(data.message))
          }
        }.bind(this))

        //////////////////////////////////////
        //////////////////////////////////////
        //////////////////////////////////////

      }
    }.bind(this), 2000);
  },
  posMatch: function() {
    if (this.state.alreadyPressed) {
      return;
    }
    if (this.state.posMatch) {
      //if correct button pressed, use current time to find reaction time
      this.setState({
        reactionStop:Date.now(),
        positionButton:'goodJob'
      })
      this.match();
    } else if (!this.state.posMatch) {
      this.setState({
        positionButton:'youFailed'
      })
      this.incorrect();
    }
    this.setState({alreadyPressed: true, posMatch: false, posStyle: pushStyle})
  },
  render: function() {
    var overlay = this.state.overlay
      ? (<StartOverlay nLevel={this.state.N} mode={this.state.mode} click={this.startGame}/>)
      : '';

    var gameTimer = this.state.overlay
      ? ""
      : (
        <GameTimer timeStyle={{
          'color': "#7CD9D2"
        }}></GameTimer>
      );

    return (
      <div className="fullGameView">
        <div className="gameContainer">
          {overlay}
          <div className="gameFullHeader">
            <span className="gameTitle">
              <h1 className="relaxed modeTitle">Relaxed</h1>
              <h1 className="relaxed nTitle">(N={this.state.N})</h1>
            </span>
            <div className="gameHeading">
              <div className="gameScore relaxed">
                <h2>Score: {parseInt(this.state.fullScore)}</h2>
                <h2 className={this.state.scoreUpdate}>{this.state.currentScore}</h2>
              </div>
              {gameTimer}
            </div>
          </div>
          <div className="gameBoard">
            <div className="gameSquare" style={this.state.style[0]}></div>
            <div className="gameSquare" style={this.state.style[1]}></div>
            <div className="gameSquare" style={this.state.style[2]}></div>
            <div className="gameSquare" style={this.state.style[3]}></div>
            <div className="gameSquare" style={this.state.style[4]}></div>
            <div className="gameSquare" style={this.state.style[5]}></div>
            <div className="gameSquare" style={this.state.style[6]}></div>
            <div className="gameSquare" style={this.state.style[7]}></div>
            <div className="gameSquare" style={this.state.style[8]}></div>
          </div>
          <div className="gameFullFooter">

            <div className="gameButtonsContainer">
              <div id="positionButton" className={this.state.positionButton}>
                <a onClick={this.positionMatch} style={this.state.posStyle} className="relaxedButton">POSITION</a>
              </div>
            </div>
          </div>
        </div>
        <Link to="/home"><img className="whiteLogo" src="../../images/CortexLogo3.png"/></Link>
      </div>
    );
  }
})

var noStyle = {}

var pushStyle = {
  backgroundColor: '#006D65',
  boxShadow: '0px 0px',
  color: 'white'
}

var standardStyle = {
  backgroundColor: "transparent",
  border: "3px solid #7CD9D2"
}

var newStyle = {
  backgroundColor: "#7CD9D2",
  border: "3px solid #7CD9D2"
}

module.exports = RelaxedMode
