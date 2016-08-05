var React = require('react');
var GameTimer = require('./gameTimer');
var ClassicStartOverlay = require('./gameStartOverlay').ClassicStartOverlay;
var axios = require('axios');
import {Link} from 'react-router'

var fullScore = 0;
var currentScore;
var matchCount = 0; //total matches in game
var matchHit = 0; ///ones user gets

var endGameFunction = require('./serverFunctions').endGameFunction;
var startGameFunction = require('./serverFunctions').startGameFunction;

//COLLECTION OF GLOBAL VARIABLES TO MAKE EVERYONES LIFE EASIER
//create global variable for reaction counter
var reactionStart;
//global variable for keeping reaction times
//note: all reactin times for correct hits stored as array for stats (max,min,avg)
var reactionTimes = [];
//global variable for game score (saved once time runs out)
var gameScore;
var reactionEnd = null;
var iterations;
var fullScore = 0;

var nextSound;
var soundInterval;

var ClassicMode = React.createClass({
  getInitialState: function() {
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
      soundMatch: false,
      score: 0,
      alert: " ",
      alertType: ' ',
      overlay: true,
      N: parseInt(this.props.params.n),
      positionPressed: false,
      soundPressed: false,
      posStyle: noStyle,
      soundStyle: noStyle,
      keepScore: false,
      tempUser: true,
      gameId: null,
      mode: 'classic',
      modeMultiplier: 1,
      penalty: 0,
      positivePoints: 0
    }
  },
  componentDidMount: function() {
    startGameFunction(this.state.mode, this.state.N, function(err, obj) {
      if (err) {
        this.props.history.push('/levels/' + this.state.mode + '/unauthorized');
        return;
      }
      console.log(obj)
      this.setState({tempUser: obj.tempUser, gameId: obj.gameId, modeMultiplier: obj.modeMultiplier, penalty: obj.penalty, positivePoints: obj.positivePoints})
    }.bind(this));
    console.log("component mounted")
  },
  componentWillUnmount: function() {
    clearInterval(iterations);
    clearInterval(soundInterval);
  },
  enableKeys: function() {
    window.onkeyup = function(e) {
      if (e.keyCode == 37) {
        this.positionMatch();
      }
      if (e.keyCode == 39) {
        this.soundMatch();
      }
    }.bind(this)
  },
  startGame: function() {
    this.setState({overlay: false});
    for (var i = 0; i < 9; i++) {
      audios[i].volume = 0;
      console.log(audios[i], audios[i].volume);
      audios[i].play();
      audios[i].volume = 1;
    }
    setTimeout(function() {
      soundInterval = setInterval(function() {
        audios[nextSound].play();
      }.bind(this), 2000);
    }.bind(this), 40);
    this.positionAndSound();
    this.enableKeys();
  },
  positionAndSound: function() {
    var positionQueue = [];
    var soundQueue = [];
    var timeTilPositionMatch = parseInt((Math.random() * 5) + this.state.N);
    var timeTilSoundMatch = parseInt((Math.random() * 5) + this.state.N);
    var timeKeeper = 44;

    iterations = setInterval(function() {
      timeKeeper--;

      //all double match cases
      if (this.state.positionMatch && this.state.soundMatch) {
        //only hit position
        if (this.state.positionPressed && !this.state.soundPressed) {
          matchHit += 1;
          reactionTimes.push(reactionEnd - reactionStart);
          currentScore = ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + 1;
          fullScore += parseFloat(currentScore);
          this.state.score += Math.floor(currentScore);
          this.setState({alert: 'Half match', alertType: 'halfPos'})
        }
        //only hit sound
        if (this.state.soundPressed && !this.state.positionPressed) {
          matchHit += 1;
          reactionTimes.push(reactionEnd - reactionStart);
          currentScore = ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + 1;
          fullScore += parseFloat(currentScore);
          this.state.score += Math.floor(currentScore);
          this.setState({alert: 'Half match', alertType: 'halfPos'})
        }
        if (this.state.soundPressed && this.state.positionPressed) {
          matchHit += 2;
          reactionTimes.push(reactionEnd - reactionStart);
          currentScore = ((2000 - reactionTimes[reactionTimes.length - 1]) * 2 / 100).toFixed(2) + 1;
          fullScore += parseFloat(currentScore);
          this.state.score += Math.floor(currentScore);
          this.setState({alert: 'Double Match!', alertType: 'full'})
        }
        //complete miss= only way to lose points in this case
        if (!this.state.soundPressed && !this.state.positionPressed) {
          this.setState({alert: 'Missed two matches', alertType: 'none'})
          if (this.state.score >= 5) {
            currentScore = 5;
            fullScore -= parseFloat(currentScore);
            this.state.score = this.state.score - 5;
          } else {
            currentScore = this.state.score;
            fullScore -= parseFloat(currentScore);
            this.state.score = 0;
          }
        }
        this.setState({
          positionMatch: false,
          soundMatch: false,
          positionPressed: false,
          soundPressed: false,
          posStyle: noStyle,
          soundStyle: noStyle,
          score: this.state.score
        })
      }

      ///sound match cases
      if (this.state.soundMatch) {
        //sound match
        if (this.state.soundPressed) {
          matchHit += 1
          this.setState({alert: 'Match!', alertType: 'full'})
          reactionTimes.push(reactionEnd - reactionStart);
          currentScore = ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + 1
          fullScore += parseFloat(currentScore);
          this.state.score += Math.floor(currentScore);
        }
        //missed sound match
        if (!this.state.soundPressed) {
          this.setState({alert: 'Missed a match!', alertType: 'none'})
          if (this.state.score >= 5) {
            currentScore = 5;
            fullScore -= parseFloat(currentScore);
            this.state.score = this.state.score - 5
          } else {
            currentScore = this.state.score;
            this.state.score = 0;
          }
        }
        //incorrect match
        if (this.state.positionPressed) {
          matchHit -= 1;
          this.setState({alert: 'Not a match!', alertType: 'none'})
          //if have double when single match
          if (currentScore) {
            //delete 5 from preassigned score
            currentScore -= 5;
            this.setState({alert: 'Not a double match!', alertType: 'halfPos'})
            //if overall negative score
            if (currentScore < 0) {
              this.setState({alert: 'Not a double match!', alertType: 'halfNeg'})
              //if remaining score is positive or 0 just deduct points
              if (this.state.score + currentScore >= 0) {
                fullScore += parseFloat(currentScore);
                this.state.score += Math.floor(currentScore //otherwise take off whatever will get user to 0
                );
              } else {
                currentScore = this.state.score;
                fullScore += parseFloat(currentScore);
                this.state.score = 0;
              }
            } else {
              fullScore -= parseFloat(currentScore) //if no preexisting score see if all 5 points can be removed;
            }
          } else if (this.state.score >= 5) {
            currentScore = 5;
            fullScore -= parseFloat(currentScore);
            this.state.score = this.state.score - //otherwise take whatever is left
            5
          } else {
            currentScore = this.state.score;
            fullScore -= parseFloat(currentScore);
            this.state.score = 0;
          }
        }
        this.setState({
          positionMatch: false,
          soundMatch: false,
          positionPressed: false,
          soundPressed: false,
          posStyle: noStyle,
          soundStyle: noStyle,
          score: this.state.score
        })
      }

      ///position match cases
      if (this.state.positionMatch) {
        //got position match
        if (this.state.positionPressed) {
          matchHit += 1;
          this.setState({alert: 'Match!', alertType: 'full'})
          reactionTimes.push(reactionEnd - reactionStart);
          currentScore = ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + 1;
          fullScore += parseFloat(currentScore);
          this.state.score += Math.floor(currentScore);
        }
        //missed position match
        if (!this.state.positionPressed) {
          this.setState({alert: 'Missed a match!', alertType: 'none'})
          if (this.state.score >= 5) {
            currentScore = 5;
            fullScore -= parseFloat(currentScore);
            this.state.score = this.state.score - 5
          } else {
            currentScore = this.state.score;
            fullScore -= parseFloat(currentScore);
            this.state.score = 0;
          }
        }
        //incorrect match
        if (this.state.soundPressed) {
          matchHit -= 1;
          this.setState({alert: 'Not a match!', alertType: 'none'})
          if (currentScore) {
            //delete 5 from preassigned score
            currentScore -= 5;
            this.setState({alert: 'Not a double match!', alertType: 'halfPos'})
            //if overall negative score
            if (currentScore < 0) {
              this.setState({alert: 'Not a double match!', alertType: 'halfNeg'})
              //if remaining score is positive or 0 just deduct points
              if (this.state.score + currentScore >= 0) {
                fullScore += parseFloat(currentScore);
                this.state.score -= Math.floor(currentScore //otherwise take off whatever will get user to 0
                );
              } else {
                currentScore = this.state.score;
                fullScore -= parseFloat(currentScore);
                this.state.score = 0;
              }
            } else {
              fullScore -= parseFloat(currentScore) //if no preexisting score see if all 5 points can be removed;
            }
          } else if (this.state.score >= 5) {
            currentScore = 5;
            fullScore -= parseFloat(currentScore);
            this.state.score = this.state.score - 5
            this.setState({alert: 'Not a match!', alertType: 'none'} //otherwise take whatever is left
            )
          } else {
            currentScore = this.state.score;
            fullScore -= parseFloat(currentScore);
            this.state.score = 0;
            this.setState({alert: 'Not a match!', alertType: 'none'})
          }
        }
        this.setState({
          positionMatch: false,
          soundMatch: false,
          positionPressed: false,
          soundPressed: false,
          posStyle: noStyle,
          soundStyle: noStyle,
          score: this.state.score
        })
      }
      //hit match when none
      if (this.state.soundPressed || this.state.positionPressed) {
        matchHit -= 1;
        this.setState({alert: 'Not a match!', alertType: 'none'})
        if (this.state.score >= 5) {
          currentScore = 5;
          fullScore -= parseFloat(currentScore);
          this.state.score = this.state.score - 5
        } else {
          currentScore = this.state.score;
          fullScore -= parseFloat(currentScore);
          this.state.score = 0;
        }
        this.setState({
          positionMatch: false,
          soundMatch: false,
          positionPressed: false,
          soundPressed: false,
          posStyle: noStyle,
          soundStyle: noStyle,
          score: this.state.score
        })
      }

      reactionStart = new Date();
      reactionEnd = null;
      setTimeout(function() {
        this.setState({alert: ' ', alertType: ' '});
      }.bind(this), 800);

      if (timeTilPositionMatch === 0) {
        matchCount += 1;
        this.setState({positionMatch: true, keepScore: true})
        //reset position portion
        timeTilPositionMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextPosition = positionQueue[0];
        positionQueue.push(nextPosition);
        positionQueue.splice(0, 1);
        var pMatch = true;
      }

      //case 2: sound match
      if (timeTilSoundMatch === 0) {
        matchCount += 1;
        this.setState({soundMatch: true, keepScore: true})
        //reset position portion
        timeTilSoundMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        nextSound = soundQueue[0];
        soundQueue.push(nextSound);
        soundQueue.splice(0, 1);
        var sMatch = true;
      }

      // // pick a non-matching next number while interval is not 0
      //position:
      if (!pMatch) {
        var nextPosition = parseInt(Math.random() * 9);
        while (nextPosition == positionQueue[0]) {
          nextPosition = parseInt(Math.random() * 9);
        }
        // resize array to N: sound
        positionQueue.push(nextPosition);
        if (positionQueue.length > this.state.N) {
          positionQueue.splice(0, 1);
        }
      }

      //sound:
      if (!sMatch) {
        nextSound = parseInt(Math.random() * 9);
        while (nextSound == soundQueue[0]) {
          nextSound = parseInt(Math.random() * 9);
        }
        // resize array to N: sound
        soundQueue.push(nextSound);
        if (soundQueue.length > this.state.N) {
          soundQueue.splice(0, 1);
        }
      }
      reactionStart = Date.now()
      // audios[nextSound].play();
      this.state.style[nextPosition] = newStyle;
      this.setState({style: this.state.style});
      setTimeout(function() {
        this.state.style[nextPosition] = standardStyle;
        this.setState({style: this.state.style});
        timeTilPositionMatch--;
        timeTilSoundMatch--;
        sMatch = false;
        pMatch = false;
      }.bind(this), 800);

      if (timeKeeper === 0) {
        clearInterval(iterations);
        clearInterval(soundInterval);
        setTimeout(function() {

          //////////////////////////////////////
          //////////////////////////////////////
          //////////////////////////////////////

          console.log(reactionTimes, 'reaction times')
          var accuracy = matchHit / matchCount;
          console.log(accuracy, 'accuracy')

          endGameFunction(fullScore, reactionTimes, this.state.gameId, accuracy, function(success) {
            if (success) {
              this.props.history.push('/gameOver')
            }
          }.bind(this))

          //////////////////////////////////////
          //////////////////////////////////////
          //////////////////////////////////////

        }.bind(this), 2000)
      }

    }.bind(this), 2000)
  },
  positionMatch: function() {
    if (this.state.positionPressed) {
      return;
    }
    if (this.state.positionMatch) {
      if (!reactionEnd) {
        reactionEnd = Date.now();
      }
    }
    this.setState({positionPressed: true, posStyle: pushStyle});
  },
  soundMatch: function() {
    if (this.state.soundPressed) {
      return;
    }
    if (this.state.soundMatch) {
      if (!reactionEnd) {
        reactionEnd = Date.now();
      }
    }
    this.setState({soundPressed: true, soundStyle: pushStyle});
  },
  render: function() {
    var overlay = this.state.overlay
      ? (<ClassicStartOverlay nLevel={this.state.N} click={this.startGame}/>)
      : '';

    var scoreAlert;
    var scoreUpdate;
    if (this.state.alertType === 'full') {
      scoreAlert = (
        <div className="scoreAlertPositive">
          {this.state.alert}
        </div>
      )
      scoreUpdate = (
        <h2 className="scoreUpdate scoreUpdatePos">+{parseInt(currentScore)}</h2>
      )
    } else if (this.state.alertType === 'none') {
      scoreAlert = (
        <div className="scoreAlertNegative">
          {this.state.alert}
        </div>
      )
      if (currentScore !== 0) {
        scoreUpdate = (
          <h2 className="scoreUpdate scoreUpdateNeg">-{parseInt(currentScore)}</h2>
        )
      }
    } else if (this.state.alertType === 'halfPos') {
      scoreAlert = (
        <div className="scoreAlertHalf">
          {this.state.alert}
        </div>
      )
      if (currentScore !== 0) {
        scoreUpdate = (
          <h2 style={{
            color: 'yellow'
          }}>+{parseInt(currentScore)}</h2>
        )
      }
    } else if (this.state.alertType === 'halfNeg') {
      scoreAlert = (
        <div className="scoreAlertHalf">
          {this.state.alert}
        </div>
      )
      if (currentScore !== 0) {
        scoreUpdate = (
          <h2 style={{
            color: 'yellow'
          }}>-{parseInt(currentScore)}</h2>
        )
      }
    } else if (this.state.alertType === 'none') {
      scoreAlert = (
        <div className="scoreAlertNegative">
          {this.state.alert}
        </div>
      )
      if (currentScore !== 0) {
        scoreUpdate = (
          <h2 style={{
            color: 'red'
          }}>-{parseInt(currentScore)}</h2>
        )
      }
    } else {
      scoreAlert = (
        <div></div>
      )
      scoreUpdate = (
        <h2></h2>
      )
    }
    var gameTimer = this.state.overlay
      ? ""
      : (
        <GameTimer timeStyle={{
          'color': "#F13542"
        }}></GameTimer>
      );

    return (
      <div className="fullGameView">
        <div className="gameContainer">
          {overlay}
          <div className="gameFullHeader">
            <span className="gameTitle">
              <h1 className="classic modeTitle">Classic</h1>
              <h1 className="classic nTitle">(N={this.state.N})</h1>
            </span>
            <div className="gameHeading">
              <div className="gameScore classic">
                <h2>Score: {this.state.score}</h2>
                {scoreUpdate}
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
            <div className="scoreAlert">
              {scoreAlert}
            </div>
            <div className="gameButtonsContainer">
              <a onClick={this.positionMatch} style={this.state.posStyle} className="classicButton">POSITION</a>
              <a onClick={this.soundMatch} style={this.state.soundStyle} className="classicButton">SOUND</a>
            </div>
          </div>
        </div>
        <Link to="/home"><img className="whiteLogo" src="./images/CortexLogo3.png"/></Link>
      </div>
    );
  }
});

var noStyle = {}

var pushStyle = {
  backgroundColor: '#A8020F',
  boxShadow: '0px 0px',
  color: 'white'
}

var standardStyle = {
  backgroundColor: "transparent",
  border: "3px solid #F13542"
}

var newStyle = {
  backgroundColor: "#F13542",
  border: "3px solid #F13542"
}

var audios = [];
for (var i = 1; i <= 9; i++) {
  audios.push(new Audio('./audio/' + i + '.wav '));
}

module.exports = ClassicMode
