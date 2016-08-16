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

var AdvancedMode = React.createClass({
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
      colorMatch: false,
      positionMatch: false,
      soundMatch: false,
      alert: " ",
      alertType: ' ',
      overlay: true,
      initialTimer: 3,
      N: parseInt(this.props.params.n),
      colorPressed: true,
      soundPressed: true,
      positionPressed: true,
      colorStyle: pushStyle,
      soundStyle: pushStyle,
      posStyle: pushStyle,
      mode: 'advanced',
      tempUser: true,
      gameId: null,
      fullScore: 0,
      currentScore: null,
      matchCount: 0,
      matchHit: 0,
      reactionStart: null,
      reactionTimes: [],
      reactionEnd: null
    }
  },
  componentDidMount: function() {
    startGameFunction(this.state.mode, this.state.N, function(err, obj) {
      if (err) {
        this.context.router.push('/levels/' + this.state.mode);
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
    this.playGame();
    this.enableKeys();
  },

  match() {
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
      }.bind(this))
    });
  },

  incorrect(number) {
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

      var tally = 0;
      if (this.state.colorMatch && !this.state.colorPressed) {
        tally++;
      }
      if (this.state.positionMatch && !this.state.positionPressed) {
        tally++;
      }
      if (this.state.soundMatch && !this.state.soundPressed) {
        tally++;
      }
      if (tally > 0) {
        this.incorrect(tally);
      }

      this.setState({
        colorMatch: false,
        soundMatch: false,
        positionMatch: false,
        soundPressed: false,
        colorPressed: false,
        positionPressed: false,
        posStyle: noStyle,
        colorStyle: noStyle,
        soundStyle: noStyle
      })
      // reactionEnd = null;
      // reactionStart = new Date();
      // this.setState({colorPressed: noStyle, soundPressed: noStyle, positionPressed: noStyle});
      setTimeout(function() {
        this.setState({alert: ' ', alertType: ' ', currentScore: null, scoreUpdate: ''});
      }.bind(this), 800);
      //NOT GOING TO ACTUALLY LIGHT UP COLORS UNTIL ALL IF STATEMENTS HAVE ITERATED
      //case 1: position match
      if (timeTilPositionMatch === 0) {
        //console.log('position match')
        //matchCount += 1;
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
        //matchCount += 1;
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
        //console.log('sound match')
        //matchCount += 1;
        this.setState({soundMatch: true, miss: true})
        //reset position portion
        timeTilSoundMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        nextSound = soundQueue[0];
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
        nextSound = parseInt(Math.random() * 9);
        while (nextSound == soundQueue[0]) {
          nextSound = parseInt(Math.random() * 9);
        }
        // resize array to N: color
        soundQueue.push(nextSound);
        if (soundQueue.length > this.state.N) {
          soundQueue.splice(0, 1);
        }
      }

      // reactionStart = Date.now()
      // reactionEnd = null;
      this.state.style[nextPosition] = newStyle[nextColor];
      this.setState({style: this.state.style, reactionStart: Date.now(), reactionEnd: null});
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

      ///RUTH THIS IS WHERE THE GAME ENDS///////////////////////////////////////////
      if (timeKeeper === 0) {
        clearInterval(iterations);
        clearInterval(soundInterval);
        setTimeout(function() {
          gameScore = this.state.score;
          // console.log(gameScore, 'game score')
          // console.log(reactionTimes, 'reaction times')
          // console.log(this.state)
          var accuracy = matchHit / matchCount;
          // console.log(accuracy, 'accuracy')

          endGameFunction(this.state.fullScore, this.state.reactionTimes, this.state.gameId, this.state.userId, function(success) {
            if (success) {
              this.context.router.push('/gameOver')
            }
          }.bind(this))

        }.bind(this), 2000);
        ////////////////////////////////////////////////////////////////////////////////////
      }
    }.bind(this), 2000);
  },
  colorMatch: function() {
    if (this.state.colorPressed) {
      return;
    }
    if (this.state.colorMatch) {
      this.setState({
        reactionEnd: Date.now()
      }, this.match);
      this.setButton('colorButton', 'goodJob');
    } else {
      this.setButton('colorButton', 'youFailed');
      this.incorrect();
    }
    this.setState({colorPressed: true, colorStyle: pushStyle});
  },
  positionMatch: function() {
    if (this.state.positionPressed) {
      return;
    }
    if (this.state.positionMatch) {
      this.setState({
        reactionEnd: Date.now()
      }, this.match);
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
      }, this.match);
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

            <div className="gameButtonsContainer advancedBtnContainer" onKeyPress={this.handleKeyPres}>
              <div id="soundButton" className={this.state.soundButton}>
                <a onClick={this.soundMatch} style={this.state.soundStyle} className="advancedButton">SOUND</a>
              </div>
              <div id="positionButton" className={this.state.positionButton}>
                <a onClick={this.positionMatch} style={this.state.posStyle} className="advancedButton">POSITION</a>
              </div>
              <div id="colorButton" className={this.state.colorButton}>
                <a onClick={this.colorMatch} style={this.state.colorStyle} className="advancedButton">COLOR</a>
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
  audios.push(new Audio('/audio/' + i + '.wav '));
}

module.exports = AdvancedMode
