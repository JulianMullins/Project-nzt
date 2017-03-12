var React = require('react');
var GameTimer = require('./gameTimer');
var StartOverlay = require('./gameStartOverlay');
var axios = require('axios');
import {Link} from 'react-router'

var endGameFunction = require('./serverFunctions').endGameFunction;
var startGameFunction = require('./serverFunctions').startGameFunction;

var iterations;
var nextSound;
var soundInterval;

var ClassicMode = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
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
      overlay: true,
      N: parseInt(this.props.params.n),
      positionPressed: true,
      soundPressed: true,
      posStyle: pushStyle,
      soundStyle: pushStyle,
      keepScore: false,
      tempUser: true,
      gameId: null,
      mode: 'classic',
      modeMultiplier: 1,
      penalty: 0,
      positivePoints: 0,
      fullScore: 0,
      currentScore: null,
      matchCount: 0,
      matchHit: 0,
      reactionTimes: [],
      reactionStart: null,
      reactionEnd: null,
      gameScore: 0,
      scoreAlert: '',
      scoreUpdate: ''
    }
  },

  componentDidMount: function() {
    startGameFunction(this.state.mode, this.state.N, function(err, obj) {
      if (err) {
        this.context.router.push('/levels/' + this.state.mode + '/unauthorized');
        return;
      }
      this.setState({
        tempUser: obj.tempUser,
        gameId: obj.gameId,
        modeMultiplier: obj.modeMultiplier,
        penalty: obj.penalty,
        positivePoints: obj.positivePoints
      })
    }.bind(this));
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
      audios[i].volume = 0.0;
    }
    setTimeout(function() {
      for (var i = 0; i < 9; i++) {
        audios[i].play();
      }
    }, 300);
    setTimeout(function() {
      for (var i = 0; i < 9; i++) {
        audios[i].volume = 1.0;
      }
    }, 1500);
    setTimeout(function() {
      soundInterval = setInterval(function() {
        audios[nextSound].play();
      }.bind(this), 2000);
    }.bind(this), 40);
    this.positionAndSound();
    this.enableKeys();
  },

  match: function() {
    this.setState({
      currentScore: (((2000 - (this.state.reactionEnd - this.state.reactionStart)) / 1000) * this.state.positivePoints).toFixed(2)
    }, function() {
      this.setState({
        reactionTimes: this.state.reactionTimes.concat([this.state.reactionEnd - this.state.reactionStart]),
        fullScore: this.state.fullScore + parseFloat(this.state.currentScore),
        matchCount: this.state.matchCount + 1,
        matchHit: this.state.matchHit + 1,
        currentScore: "+" + parseInt(this.state.currentScore),
        scoreUpdate: 'scoreUpdate scoreUpdatePos'
      }, function() {
        $('.gameScore').append('<h2 class="' + this.state.scoreUpdate + '">' + this.state.currentScore + '</h2>')
        setTimeout(function() {
          $('.gameScore h2:nth-child(2)').remove();
        }, 800)
      }.bind(this));
    }.bind(this));
  },

  incorrect: function(number) {
    if (!number) {
      number = 1
    }
    var updateScore = 0;
    if ((this.state.fullScore - number * this.state.penalty) >= 0) {
      updateScore = -this.state.penalty;
    } else {
      updateScore = -this.state.fullScore;
    }
    this.setState({
      //reactionTimes: this.state.reactionTimes.concat([this.state.reactionEnd - this.state.reactionStart]),
      //matchHit: this.state.matchHit - 1,
      matchCount: this.state.matchCount + 1,
      fullScore: this.state.fullScore + updateScore,
      currentScore: parseInt(updateScore),
      scoreUpdate: 'scoreUpdate scoreUpdateNeg'
    }, function() {
      $('.gameScore').append('<h2 class="' + this.state.scoreUpdate + '">' + this.state.currentScore + '</h2>')
      setTimeout(function() {
        $('.gameScore h2:nth-child(2)').remove();
      }, 800)
    }.bind(this));
  },

  setButton: function(button, _class) {
    var obj = {};
    obj[button] = _class;
    this.setState(obj, function() {
      setTimeout(function() {
        obj[button] = '';
        this.setState(obj);
      }.bind(this), 200);
    }.bind(this))
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

        if (!this.state.soundPressed && !this.state.positionPressed) {
          this.incorrect(2);
          this.setButton('soundButton', 'youFailed')
          this.setButton('positionButton', 'youFailed')
        } else if (!this.state.soundPressed) {
          this.incorrect();
          this.setButton('soundButton', 'youFailed')
        } else if (!this.state.positionPressed) {
          this.incorrect();
          this.setButton('positionButton', 'youFailed') ///sound match cases
        }

      } else if (this.state.soundMatch) {

        //missed sound match
        if (!this.state.soundPressed) {
          this.incorrect();
          this.setButton('soundButton', 'youFailed') ///position match cases
        }

      } else if (this.state.positionMatch) {

        //missed position match
        if (!this.state.positionPressed) {
          //this.missedSingle('Missed a position match!','none');
          this.incorrect();
          this.setButton('positionButton', 'youFailed')
        }

      }

      this.setState({
        reactionStart: new Date(),
        reactionEnd: null,
        positionMatch: false,
        soundMatch: false,
        positionPressed: false,
        soundPressed: false,
        posStyle: noStyle,
        soundStyle: noStyle,
        //score: this.state.score
      })
      setTimeout(function() {
        this.setState({alert: ' ', alertType: ' ', currentScore: null, scoreUpdate: ''});
      }.bind(this), 800);

      if (timeTilPositionMatch === 0) {
        //matchCount += 1;
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
        //matchCount += 1;
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
      //reactionStart = Date.now()

      this.setState({reactionStart: Date.now()})

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



///////////////////////////////////////////////////////

        if (timeKeeper === 0) {
          clearInterval(iterations);
          clearInterval(soundInterval);
          setTimeout(function() {


          var accuracy = this.state.matchHit / this.state.matchCount;
          endGameFunction(this.state.fullScore, this.state.reactionTimes, this.state.gameId, accuracy, function(success) {
            if (success) {
              this.context.router.push('/gameOver')
            }
          }.bind(this))

///////////////////////////////////////////////////////

        }.bind(this), 2000)
      }
    }.bind(this), 2000)
  },
  positionMatch: function() {
    if (this.state.positionPressed) {
      return;
    }
    if (this.state.positionMatch) {
      this.setState({
        reactionEnd: Date.now()
      }, this.match)
      this.setButton('positionButton', 'goodJob');
    } else {
      this.setButton('positionButton', 'youFailed');
      this.incorrect();
    }
    this.setState({positionPressed: true, posStyle: pushStyle});
  },
  soundMatch: function() {
    if (this.state.soundPressed) {
      return;
    }
    if (this.state.soundMatch) {
      this.setState({
        reactionEnd: Date.now()
      }, this.match)
      this.setButton('soundButton', 'goodJob');
    } else {
      this.setButton('soundButton', 'youFailed');
      this.incorrect();
    }
    this.setState({soundPressed: true, soundStyle: pushStyle});
  },

  render: function() {
    var overlay = this.state.overlay
      ? (<StartOverlay nLevel={this.state.N} mode={this.state.mode} click={this.startGame}/>)
      : '';

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
                <h2>Score: {parseInt(this.state.fullScore)}</h2>
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
                <a onClick={this.positionMatch} style={this.state.posStyle} className="classicButton">POSITION</a>
              </div>
              <div id="soundButton" className={this.state.soundButton}>
                <a onClick={this.soundMatch} style={this.state.soundStyle} className="classicButton">SOUND</a>
              </div>
            </div>
          </div>
        </div>
        <Link to="/home"><img className="whiteLogo" src="../../images/CortexLogo3.png"/></Link>
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
  audios.push(new Audio('/audio/' + i + '.mp3 '));
}
module.exports = ClassicMode
