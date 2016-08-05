var React = require('react');
var GameTimer = require('./gameTimer');
var axios = require('axios');
import {Link} from 'react-router'

var AdvancedStartOverlay = require('./gameStartOverlay').AdvancedStartOverlay;
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

var AdvancedMode = React.createClass({
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
      colorMatch: false,
      positionMatch: false,
      soundMatch: false,
      score: 0,
      alert: " ",
      overlay: true,
      initialTimer: 3,
      N: parseInt(this.props.params.n),
      colorPressed: noStyle,
      soundPressed: noStyle,
      positionPressed: noStyle,
      //color, sound, popsistion
      correct: [
        false, false, false
      ],
      mode: 'advanced',
      tempUser: true,
      gameId: null
    }
  },
  componentDidMount: function() {
    startGameFunction(this.state.mode, this.state.N, function(err, obj) {
      if (err) {
        this.props.history.push('/levels/' + this.state.mode);
      }
      this.setState({
        tempUser: obj.tempUser,
        gameId: obj.gameId,
        modeMultiplier: obj.modeMultiplier,
        penalty: obj.penalty,
        positivePoints: obj.positivePoints,
        userId: obj.userId
      })
    }.bind(this));
    console.log("component mounted")
  },
  componentWillUnmount: function() {
    clearInterval(iterations);
  },
  enableKeys: function() {
    window.onkeyup = function(e) {
      if (e.keyCode == 37) {
        this.soundMatch();
      }
      if (e.keyCode == 38) {
        this.positionMatch();
      }
      if (e.keyCode == 39) {
        this.colorMatch();
      }
    }.bind(this)
  },
  startGame: function() {
    this.setState({overlay: false});
    audios[0].play();
    setInterval(function() {audios[0].play()}, 1);
    this.playGame();
    this.enableKeys();
  },
  playGame: function() {
    var positionQueue = [];
    var colorQueue = [];
    var soundQueue = [];
    var timeTilPositionMatch = parseInt((Math.random() * 5) + this.state.N);
    var timeTilColorMatch = parseInt((Math.random() * 5) + this.state.N);
    var timeTilSoundMatch = parseInt((Math.random() * 5) + this.state.N);
    var timeKeeper = 44;
    //console.log(timekeeper)
    iterations = setInterval(function() {
      timeKeeper--;
      if (!this.state.correct[0] && !this.state.correct[1] && !this.state.correct[2]) {
        if (!this.state.colorMatch && !this.state.positionMatch && !this.state.soundMatch) {
          //console.log('no matches')
          this.setState({
            soundPressed: noStyle,
            colorPressed: noStyle,
            positionPressed: noStyle,
            colorMatch: false,
            soundMatch: false,
            positionMatch: false,
            correct: [false, false, false]
          })
          reactionEnd = null;
        } else {
          matchCount += 1;
          this.setState({
            soundPressed: noStyle,
            colorPressed: noStyle,
            positionPressed: noStyle,
            colorMatch: false,
            soundMatch: false,
            positionMatch: false,
            correct: [
              false, false, false
            ],
            alert: "Missed a match"
          })
          reactionEnd = null;
          if ((this.state.score - 5) >= 0) {
            currentScore = 5;
            this.setState({
              score: this.state.score - 5
            });
          } else {
            currentScore = this.state.score;
            this.setState({score: 0});
          }
        }
      } else if (this.state.correct[0] === this.state.colorMatch && this.state.correct[1] === this.state.soundMatch && this.state.correct[2] === this.state.positionMatch) {
        reactionTimes.push(reactionEnd - reactionStart);
        currentScore = ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2);
        fullScore += parseFloat(currentScore);
        reactionEnd = null;
        matchHit += 1;
        matchCount += 1;
        this.setState({
          soundPressed: noStyle,
          colorPressed: noStyle,
          positionPressed: noStyle,
          colorMatch: false,
          soundMatch: false,
          positionMatch: false,
          correct: [
            false, false, false
          ],
          alert: "Good job!",
          score: this.state.score + parseInt(currentScore)
        })
      } else {
        //console.log('incorrect')
        matchHit -= 1;
        this.setState({
          soundPressed: noStyle,
          colorPressed: noStyle,
          positionPressed: noStyle,
          colorMatch: false,
          soundMatch: false,
          positionMatch: false,
          correct: [
            false, false, false
          ],
          alert: 'Not a match'
        })
        if ((this.state.score - 5) >= 0) {
          currentScore = 5;
          this.setState({
            score: this.state.score - 5
          });
        } else {
          currentScore = this.state.score;
          this.setState({score: 0});
        }
      }

      this.setState({colorPressed: noStyle, soundPressed: noStyle, positionPressed: noStyle});
      setTimeout(function() {
        this.setState({alert: ' '});
      }.bind(this), 800);
      //NOT GOING TO ACTUALLY LIGHT UP COLORS UNTIL ALL IF STATEMENTS HAVE ITERATED
      //case 1: position match
      if (timeTilPositionMatch === 0) {
        //console.log('position match')
        this.setState({positionMatch: true, miss: true})
        //reset position portion
        timeTilPositionMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextPosition = positionQueue[0];
        positionQueue.push(nextPosition);
        positionQueue.splice(0, 1);
        var pMatch = true;
      }
      //case 2: color match
      if (timeTilColorMatch === 0) {
        //console.log('color match')
        this.setState({colorMatch: true, miss: true})
        //reset position portion
        timeTilColorMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextColor = colorQueue[0];
        colorQueue.push(nextColor);
        colorQueue.splice(0, 1);
        var cMatch = true;
      }
      //case 3: sound match
      if (timeTilSoundMatch === 0) {
        // console.log('sound match')
        this.setState({soundMatch: true, miss: true})
        //reset position portion
        timeTilSoundMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextSound = soundQueue[0];
        soundQueue.push(nextSound);
        soundQueue.splice(0, 1);
        var sMatch = true;
      }
      // pick a non-matching next number while interval is not 0
      //position:
      if (!pMatch) {
        var nextPosition = parseInt(Math.random() * 9);
        while (nextPosition == positionQueue[0]) {
          nextPosition = parseInt(Math.random() * 9);
        }
        // resize array to N: color
        positionQueue.push(nextPosition);
        if (positionQueue.length > this.state.N) {
          positionQueue.splice(0, 1);
        }
      }
      //color:
      if (!cMatch) {
        var nextColor = parseInt(Math.random() * 9);
        while (nextColor == colorQueue[0]) {
          nextColor = parseInt(Math.random() * 9);
        }
        // resize array to N: color
        colorQueue.push(nextColor);
        if (colorQueue.length > this.state.N) {
          colorQueue.splice(0, 1);
        }
      }
      //sound:
      if (!sMatch) {
        var nextSound = parseInt(Math.random() * 9);
        while (nextSound == soundQueue[0]) {
          nextSound = parseInt(Math.random() * 9);
        }
        // resize array to N: color
        soundQueue.push(nextSound);
        if (soundQueue.length > this.state.N) {
          soundQueue.splice(0, 1);
        }
      }

      reactionStart = Date.now()
      this.state.style[nextPosition] = newStyle[nextColor];
      audios[nextSound].play();
      this.setState({style: this.state.style});
      setTimeout(function() {
        this.state.style[nextPosition] = standardStyle;
        this.setState({style: this.state.style});
        timeTilPositionMatch--;
        timeTilSoundMatch--;
        timeTilColorMatch--;
        sMatch = false;
        cMatch = false;
        pMatch = false;
      }.bind(this), 800);

      ////////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////
      //RUTH THIS IS WHERE THE GAME ENDS///////////////////////////////////////////

      if (timeKeeper === 0) {
        clearInterval(iterations);
        setTimeout(function() {
          gameScore = this.state.score;
          console.log(gameScore, 'game score')
          console.log(reactionTimes, 'reaction times')
          console.log(this.state)
          console.log(matchHit / matchCount, 'accuracy')

          endGameFunction(fullScore, reactionTimes, this.state.gameId, this.state.userId, function(success) {
            if (success) {
              this.props.history.push('/gameOver')
            }
          }.bind(this))

        }.bind(this), 2000);
        ////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////

      }
    }.bind(this), 2000);
  },
  colorMatch: function() {
    if (!reactionEnd) {
      reactionEnd = Date.now();
    }
    this.state.correct[0] = true;
    this.setState({colorPressed: pushStyle, correct: this.state.correct});
  },
  positionMatch: function() {
    if (!reactionEnd) {
      reactionEnd = Date.now();
    }
    this.state.correct[2] = true;
    this.setState({positionPressed: pushStyle, correct: this.state.correct});
  },
  soundMatch: function() {
    if (!reactionEnd) {
      reactionEnd = Date.now();
    }
    this.state.correct[1] = true;
    this.setState({soundPressed: pushStyle, correct: this.state.correct});
  },
  render: function() {
    var overlay = this.state.overlay
      ? (<AdvancedStartOverlay nLevel={this.state.N} click={this.startGame}/>)
      : '';

    var scoreAlert;
    var scoreUpdate;
    if (this.state.alert === "Good job!") {
      scoreAlert = (
        <div className="scoreAlertPositive">
          {this.state.alert}
        </div>
      )
      scoreUpdate = (
        <h2 className="scoreUpdate scoreUpdatePos">+{parseInt(currentScore)}</h2>
      )
    } else if (this.state.alert === "Not a match" || this.state.alert === "Missed a match") {
      scoreAlert = (
        <div className="scoreAlertNegative">
          {this.state.alert}
        </div>
      )
      if (this.state.score > 0) {
        scoreUpdate = (
          <h2 className="scoreUpdate scoreUpdateNeg">-{currentScore}</h2>
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
          'color': "#F1BA03"
        }}></GameTimer>
      );

    return (
      <div className="fullGameView">
        <div className="gameContainer">
          {overlay}
          <div className="gameFullHeader">
            <span className="gameTitle">
              <h1 className="advanced modeTitle">Advanced</h1>
              <h1 className="advanced nTitle">(N={this.state.N})</h1>
            </span>
            <div className="gameHeading">
              <div className="gameScore advanced">
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
            <div className="gameButtonsContainer" onKeyPress={this.handleKeyPres}>
              <a onClick={this.soundMatch} style={this.state.soundPressed} className='advancedButton'>SOUND</a>
              <a onClick={this.positionMatch} style={this.state.positionPressed} className='advancedButton'>POSITION</a>
              <a onClick={this.colorMatch} style={this.state.colorPressed} className='advancedButton'>COLOR</a>
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
  backgroundColor: '#957300',
  boxShadow: '0px 0px',
  color: 'white'
}

var standardStyle = {
  backgroundColor: "#BFBFBF"
}

var newStyle = [
  {
    backgroundColor: '#00cc33' //green
  }, {
    backgroundColor: '#000000' //black
  }, {
    backgroundColor: '#33ccff', //light blue
    border: "5px solid #333366" //dark blue border
  }, {
    backgroundColor: '#ffffff', //white
    border: "5px solid black" //black border
  }, {
    backgroundColor: '#ffff00' //yellow
  }, {
    backgroundColor: '#ff6699' //light pink
  }, {
    backgroundColor: '#9933cc' //purple
  }, {
    backgroundColor: "#cc9966", //light brown
    border: "5px solid #663300" //dark brown border
  }, {
    backgroundColor: '#cc3333' //red
  }
]

var audios = [];
for (var i = 1; i <= 9; i++) {
  audios.push(new Audio('./audio/' + i + '.wav '));
}

module.exports = AdvancedMode
