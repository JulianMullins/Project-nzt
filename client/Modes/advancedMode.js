var React = require('react');
var GameTimer = require('./gameTimer');
var StartOverlay = require('./gameStartOverlay');
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
var currentScore;
var fullScore = 0;

var nextSound;
var soundInterval;

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
      alertType: ' ',
      overlay: true,
      initialTimer: 3,
      N: parseInt(this.props.params.n),
      colorPressed: noStyle,
      soundPressed: noStyle,
      positionPressed: noStyle,
      colorHit: false,
      soundHit: false,
      positionHit: false,
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
    clearInterval(soundInterval);
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
    var aud = new Audio('./audio/empty.mp3');
    aud.play();
    setInterval(function() {
      aud.src = './audio/' + (nextSound + 1) + '.wav';
      aud.play();
    }, 2000);
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
      ///triple match:
      if (this.state.colorMatch && this.state.soundMatch && this.state.positionMatch) {
        var count = 0;
        currentScore = 0;
        //got color match correct
        if (reactionEnd) {
          reactionTimes.push(reactionEnd - reactionStart);
        }
        //points for color match
        if (this.state.colorHit) {
          count += 1;
          currentScore += ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + 1;
        }
        //points for position match
        if (this.state.positionHit) {
          count += 1
          currentScore += ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + 1;
        }
        //points for sound match
        if (this.state.soundHit) {
          count += 1
          currentScore += ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + 1;
        }

        this.state.score += parseInt(currentScore);
        if (count === 3) {
          this.setState({alertType: 'full', alert: 'Triple Match!'})
        }

        if (count === 2) {
          this.setState({alertType: 'half', alert: 'Partial Match!'})
        }

        if (count === 1) {
          this.setState({alertType: 'half', alert: 'Partial Match!'})
        }
        //no matches hit of count is still 0
        if (count === 0) {
          //set alerts
          currentScore -= 5;
          this.setState({alertType: 'none', alert: 'Missed a Match!'})
        }

        if (this.state.score + currentScore < 0) {
          currentScore = this.state.score;
          this.state.score = 0;
          fullScore = 0;
        } else {
          this.state.score += parseInt(currentScore);
        }
        fullScore += parseFloat(currentScore);

        ///reset the states at the end
        this.setState({
          colorMatch: false,
          soundMatch: false,
          positionMatch: false,
          soundHit: false,
          colorHit: false,
          positionHit: false,
          positionPressed: noStyle,
          colorPressed: noStyle,
          soundPressed: noStyle,
          score: this.state.score
        } //all other match combinations below
        )
      } else {
        if (reactionEnd) {
          reactionTimes.push(reactionEnd - reactionStart);
        }
        currentScore = 0;
        //all sound match possibilites
        if (this.state.soundMatch) {
          if (this.state.colorMatch) {
            //not a match
            if (this.state.positionHit) {
              currentScore -= 5;

              this.setState({alertType: 'half', alert: 'Not A Match!'})
            }
            //double match
            if (this.state.soundHit && this.state.colorHit) {
              currentScore += ((2000 - reactionTimes[reactionTimes.length - 1]) * 2 / 100).toFixed(2) + 1;
              this.setState({alertType: 'full', alert: 'Double Match!'} //1/2 match
              )
            } else if (this.state.soundHit || this.state.colorHit) {
              currentScore += ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + 1;
              this.setState({alertType: 'half', alert: 'Half Match!'} //missed both
              )
            } else {
              currentScore -= 5;
              this.setState({alertType: 'none', alert: 'Missed A Match!'})
              if (this.state.score + currentScore >= 0) {
                this.state.score += currentScore;
              } else {
                currentScore -= this.state.score;
                this.state.score = 0;
              }
            }
          } else if (this.state.positionMatch) {
            //color hit but no match
            if (this.state.colorHit) {
              currentScore -= 5;
              this.setState({alertType: 'none', alert: 'Not a Match!'})
            }
            //double match
            if (this.state.soundHit && this.state.positionHit) {
              currentScore += ((2000 - reactionTimes[reactionTimes.length - 1]) * 2 / 100).toFixed(2) + 1;
              this.setState({alertType: 'full', alert: 'Double Match!'} //1/2 match
              )
            } else if (this.state.soundHit || this.state.positionHit) {
              currentScore += ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + 1;
              this.setState({alertType: 'half', alert: 'Half Match!'} //missed both
              )
            } else {
              currentScore -= 5;
              this.setState({alertType: 'none', alert: 'Missed a Match!'})
              if (this.state.score + currentScore >= 0) {
                this.state.score += currentScore;
              } else {
                currentScore -= this.state.score;
                this.state.score = 0;
                //only sound match, so hit, miss, or wrong match
              }
            }
          } else {
            //hit
            if (this.state.soundHit) {
              currentScore += ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + 1;
              this.setState({alertType: 'full', alert: 'Single Match!'} //miss
              )
            } else if (!this.state.soundHit) {
              currentScore -= 5;
              this.setState({alertType: 'none', alert: 'Missed a Match!'} //wrong match
              )
            } else if (this.state.colorHit || this.state.positionHit) {
              currentScore -= 5;
              this.setState({alertType: 'none', alert: 'Not a Match!'})
              if (this.state.score + currentScore >= 0) {
                this.state.score += currentScore;
              } else {
                currentScore -= this.state.score;
                this.state.score = 0;
              }
            }
          }
          this.setState({
            colorMatch: false,
            soundMatch: false,
            positionMatch: false,
            soundHit: false,
            colorHit: false,
            positionHit: false,
            positionPressed: noStyle,
            colorPressed: noStyle,
            soundPressed: noStyle
          })
        }
        /////all color match possibilities
        if (this.state.colorMatch) {
          // skip sound match combos since covered above, all position match options
          if (this.state.positionMatch) {
            //wrong match
            if (this.state.soundHit) {
              currentScore -= 5;
              this.setState({alertType: 'none', alert: 'Not a Match!'})
              if (this.state.score + currentScore >= 0) {
                this.state.score += currentScore;
              } else {
                currentScore -= this.state.score;
                this.state.score = 0;
              }
            }
            //double match
            if (this.state.positionHit && this.state.colorHit) {
              currentScore += ((2000 - reactionTimes[reactionTimes.length - 1]) * 2 / 100).toFixed(2) + 1;
              this.setState({alertType: 'full', alert: 'Double Match!'} //1/2 match
              )
            } else if (this.state.positionHit || this.state.colorHit) {
              currentScore += ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + 1;
              this.setState({alertType: 'half', alert: 'Half Match!'} //missed both
              )
            } else {
              currentScore -= 5;
              this.setState({alertType: 'none', alert: 'Missed a Match!'})
              if (this.state.score + currentScore >= 0) {
                this.state.score += currentScore;
              } else {
                currentScore -= this.state.score;
                this.state.score = 0;
                //  only color match, so hit, miss, or wrong match
              }
            }
          } else {
            //hit
            if (this.state.colorHit) {
              this.setState({alertType: 'full', alert: 'Single Match!'})
              currentScore += ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + //miss
              1;
            } else if (!this.state.colorHit) {
              currentScore -= 5;
              this.setState({alertType: 'none', alert: 'Missed a Match!'})
              if (this.state.score + currentScore >= 0) {
                this.state.score += currentScore;
              } else {
                currentScore -= this.state.score;
                this.state.score = 0 ///wrong match;
              }
            } else if (this.state.soundHit || this.state.positionHit) {
              currentScore -= 5;
              this.setState({alertType: 'none', alert: 'Not a Match!'})
              if (this.state.score + currentScore >= 0) {
                this.state.score += currentScore;
              } else {
                currentScore -= this.state.score;
                this.state.score = 0;
              }
            }
          }
          this.setState({
            colorMatch: false,
            soundMatch: false,
            positionMatch: false,
            soundHit: false,
            colorHit: false,
            positionHit: false,
            positionPressed: noStyle,
            colorPressed: noStyle,
            soundPressed: noStyle
          })
        }
        //position match cases, only single case because color/sound options addressed above
        if (this.state.positionMatch) {
          //hit
          if (this.state.positionHit) {
            this.setState({alertType: 'full', alert: 'Single Match!'})
            currentScore += ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2) + //miss
            1;
          } else if (!this.state.positionHit) {
            currentScore -= 5;
            this.setState({alertType: 'none', alert: 'Missed a Match!'} ///wrong match
            )
          } else if (this.state.soundHit || this.state.colorHit) {
            currentScore -= 5;
            this.setState({alertType: 'half', alert: 'Not a Match!'})
            if (this.state.score + currentScore >= 0) {
              this.state.score += currentScore;
            } else {
              currentScore -= this.state.score;
              this.state.score = 0;
            }
          }
        }
        if (this.state.score + currentScore < 0) {
          currentScore = this.state.score;
          this.state.score = 0;
          fullScore = 0;
        } else {
          this.state.score += parseInt(currentScore);
        }
        fullScore += parseFloat(currentScore);
        //reset states
        this.setState({
          colorMatch: false,
          soundMatch: false,
          positionMatch: false,
          soundHit: false,
          colorHit: false,
          positionHit: false,
          positionPressed: noStyle,
          colorPressed: noStyle,
          soundPressed: noStyle,
          score: this.state.score
        })
      }
      reactionEnd = null;
      reactionStart = new Date();
      this.setState({colorPressed: noStyle, soundPressed: noStyle, positionPressed: noStyle});
      setTimeout(function() {
        this.setState({alert: ' ', alertType: ' '});
      }.bind(this), 800);
      //NOT GOING TO ACTUALLY LIGHT UP COLORS UNTIL ALL IF STATEMENTS HAVE ITERATED
      //case 1: position match
      if (timeTilPositionMatch === 0) {
        console.log('position match')
        matchCount += 1;
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
        console.log('color match')
        matchCount += 1;
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
        console.log('sound match')
        matchCount += 1;
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
      reactionEnd = null;
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

      //RUTH THIS IS WHERE THE GAME ENDS///////////////////////////////////////////
      if (timeKeeper === 0) {
        clearInterval(iterations);
        clearInterval(soundInterval);
        setTimeout(function() {
          gameScore = this.state.score;
          console.log(gameScore, 'game score')
          console.log(reactionTimes, 'reaction times')
          console.log(this.state)
          var accuracy = matchHit / matchCount;
          console.log(accuracy, 'accuracy')

          endGameFunction(fullScore, reactionTimes, this.state.gameId, this.state.userId, function(success) {
            if (success) {
              this.props.history.push('/gameOver')
            }
          }.bind(this))

        }.bind(this), 2000);
        ////////////////////////////////////////////////////////////////////////////////////
      }
    }.bind(this), 2000);
  },
  colorMatch: function() {
    if (!reactionEnd) {
      reactionEnd = Date.now();
    }
    this.state.colorHit = true;
    this.setState({colorPressed: pushStyle, correct: this.state.colorHit});
  },
  positionMatch: function() {
    if (!reactionEnd) {
      reactionEnd = Date.now();
    }
    this.state.positionHit = true;
    this.setState({positionPressed: pushStyle, correct: this.state.positionHit});
  },
  soundMatch: function() {
    if (!reactionEnd) {
      reactionEnd = Date.now();
    }
    this.state.soundHit = true;
    this.setState({soundPressed: pushStyle, correct: this.state.soundHit});
  },
  render: function() {
    var overlay = this.state.overlay
      ? (<StartOverlay nLevel={this.state.N} mode={this.state.mode} click={this.startGame}/>)
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
    } else if (this.state.alertType === 'half') {
      scoreAlert = (
        <div className="scoreAlertHalf">
          {this.state.alert}
        </div>
      )
      if (currentScore > 0) {
        scoreUpdate = (
          <h2 style={{
            color: 'yellow'
          }}>+{parseInt(currentScore)}</h2>
        )
      }
      if (currentScore < 0) {
        scoreUpdate = (
          <h2 style={{
            color: 'yellow'
          }}>{parseInt(currentScore)}</h2>
        )
      }
    } else if (this.state.alertType === 'none') {
      scoreAlert = (
        <div className="scoreAlertNegative">
          {this.state.alert}
        </div>
      )
      if (currentScore > 0) {
        scoreUpdate = (
          <h2 style={{
            color: 'yellow'
          }}>+{parseInt(currentScore)}</h2>
        )
      } else if (parseInt(currentScore) < 0) {
        scoreUpdate = (
          <h2 style={{
            color: 'yellow'
          }}>{parseInt(currentScore)}</h2>
        ) //}
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
        <div className="gameContainer
    ">
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
  backgroundColor: "transparent",
  border: "3px solid #F1BA03"
}

var newStyle = [
  {
    backgroundColor: '#00cc33', //green
    border: "3px solid #00cc33"
  }, {
    backgroundColor: '#000000', //black
    border: "3px solid #000000"
  }, {
    backgroundColor: '#33ccff', //light blue
    border: "3px solid #33ccff"
  }, {
    backgroundColor: '#ffffff', //white
    border: "3px solid black" //black border
  }, {
    backgroundColor: '#ffff00', //yellow
    border: "3px solid #ffff00"
  }, {
    backgroundColor: '#ff6699', //light pink
    border: "3px solid #ff6699"
  }, {
    backgroundColor: '#9933cc', //purple
    border: "3px solid #9933cc"
  }, {
    backgroundColor: "#bfbfbf", //grey
    border: "3px solid #bfbfbf"
  }, {
    backgroundColor: '#cc3333', //red
    border: "3px solid #cc3333"
  }
]

var audios = [];
for (var i = 1; i <= 9; i++) {
  audios.push(new Audio('./audio/' + i + '.wav '));
}

module.exports = AdvancedMode
