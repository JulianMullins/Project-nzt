var React = require('react');
var GameTimer = require('./gameTimer');
var StartOverlay = require('./gameStartOverlay');
var axios = require('axios');
import {Link} from 'react-router'

var endGameFunction = require('./serverFunctions').endGameFunction;
var startGameFunction = require('./serverFunctions').startGameFunction;

//COLLECTION OF GLOBAL VARIABLES TO MAKE EVERYONES LIFE EASIER
//create global variable for reaction counter
//var reactionStart;
//global variable for keeping reaction times
//note: all reactin times for correct hits stored as array for stats (max,min,avg)
//var reactionTimes = [];
//global variable for game score (saved once time runs out)
// var gameScore;
// var reactionEnd = null;
var iterations;
// var fullScore = 0;
// var currentScore;
// var matchCount = 0; //total matches in game
// var matchHit = 0; ///ones user gets

var SilentMode = React.createClass({
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
      colorMatch: false,
      alert: " ",
      overlay: true,
      N: parseInt(this.props.params.n),
      positionPressed: true,
      colorPressed: true,
      colorStyle: pushStyle,
      posStyle: pushStyle,
      tempUser: true,
      gameId: null,
      mode: this.props.location.pathname.split('/')[2],
      alertType: ' ',
      reactionTimes: [],
      reactionStart: null,
      reactionEnd: null,
      fullScore: 0,
      currentScore: null,
      matchHit: 0,
      matchCount: 0
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
        penalty: obj.penalty * obj.modeMultiplier,
        positivePoints: obj.positivePoints * obj.modeMultiplier
      })
    }.bind(this));
  },
  componentWillUnmount: function() {
    clearInterval(iterations);
  },
  enableKeys: function() {
    window.onkeyup = function(e) {
      if (e.keyCode == 37) {
        this.positionMatch();
      } else if (e.keyCode == 39) {
        this.colorMatch();
      }
    }.bind(this);
  },
  startGame: function() {
    this.setState({overlay: false});
    this.positionAndColor();
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
      }.bind(this));
    }.bind(this));
  },

  incorrect(number) {
    if (!number) {
      number = 1
    }
    var updateScore = 0;
    if ((this.state.fullScore - number * this.state.penalty) >= 0) {
      updateScore = -this.state.penalty
    } else {
      updateScore = -this.state.fullScore
    }
    this.setState({
      reactionTimes: this.state.reactionTimes.concat([this.state.reactionEnd - this.state.reactionStart]),
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
      }.bind(this), 500);
    }.bind(this))
  },

  positionAndColor: function() {
    var positionQueue = [];
    var colorQueue = [];
    var timeTilPositionMatch = parseInt((Math.random() * 5) + this.state.N);
    var timeTilColorMatch = parseInt((Math.random() * 5) + this.state.N);
    var timeKeeper = 44;

    iterations = setInterval(function() {
      timeKeeper--;

      if (this.state.positionMatch && this.state.colorMatch) {

        if (!this.state.colorPressed && !this.state.positionPressed) {
          this.incorrect(2);
          this.setButton('positionButton', 'youFailed');
          this.setButton('colorButton', 'youFailed');
        } else if (!this.state.colorPressed) {
          this.incorrect();
          this.setButton('colorButton', 'youFailed')
        } else if (!this.state.positionPressed) {
          this.incorrect();
          this.setButton('positionButton', 'youFailed') ///color match cases
        }
      } else if (this.state.colorMatch) {
        //missed color match
        if (!this.state.colorPressed) {
          this.incorrect();
          this.setButton('colorButton', 'youFailed'); ///position match cases
        }
      } else if (this.state.positionMatch) {
        //missed position match
        if (!this.state.positionPressed) {
          //this.missedSingle('Missed a position match!','none');
          this.incorrect();
          this.setButton('positionButton', 'youFailed');
        }
      }
      this.setState({
        positionMatch: false,
        colorMatch: false,
        positionPressed: false,
        colorPressed: false,
        posStyle: noStyle,
        colorStyle: noStyle,
        scoreUpdate: ''
      })
      // Remove alert
      setTimeout(function() {
        this.setState({
          alert: ' ',
          alertType: ' ',
          currentScore: null,
          scoreUpdate: '',
          positionButton: '',
          colorButton: ''
        });
      }.bind(this), 800);

      //case 1: position match
      if (timeTilPositionMatch == 0) {
        //matchCount += 1;
        this.setState({positionMatch: true})
        //reset position portion
        timeTilPositionMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextPosition = positionQueue[0];
        positionQueue.push(nextPosition);
        positionQueue.splice(0, 1);
        var pMatch = true;
      }
      //case 2: color match
      if (timeTilColorMatch == 0) {
        //matchCount += 1;
        this.setState({colorMatch: true})
        //reset position portion
        timeTilColorMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextColor = colorQueue[0];
        colorQueue.push(nextColor);
        colorQueue.splice(0, 1);
        var cMatch = true;
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

      // reactionEnd = null;
      // reactionStart = Date.now()
      this.state.style[nextPosition] = newStyle[nextColor];
      this.setState({style: this.state.style, reactionEnd: null, reactionStart: Date.now()});
      setTimeout(function() {
        this.state.style[nextPosition] = standardStyle;
        this.setState({style: this.state.style});
        timeTilPositionMatch--;
        timeTilColorMatch--;
        cMatch = false;
        pMatch = false;
      }.bind(this), 800);

      ////////RUTH THIS IS WHERE THE GAME ENDS////////////////
      if (timeKeeper === 0) {
        clearInterval(iterations);
        setTimeout(function() {
          endGameFunction(this.state.fullScore, this.state.reactionTimes, this.state.gameId, this.state.userId, function(success) {
            if (success) {
              this.context.router.push('/gameOver')
            }
          }.bind(this))

        }.bind(this), 2000);
      }

      ///////////////////////////////////////////////////

    }.bind(this), 2000);
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
  render: function() {
    var overlay = this.state.overlay
      ? (<StartOverlay nLevel={this.state.N} mode={this.state.mode} click={this.startGame}/>)
      : '';

    var gameTimer = this.state.overlay
      ? ""
      : (
        <GameTimer timeStyle={{
          'color': "#01B6A7"
        }}></GameTimer>
      );

    return (
      <div className="fullGameView">
        <div className="gameContainer">
          {overlay}
          <div className="gameFullHeader">
            <span className="gameTitle">
              <h1 className="silent modeTitle">Silent</h1>
              <h1 className="silent nTitle">(N={this.state.N})</h1>
            </span>
            <div className="gameHeading">
              <div className="gameScore silent">
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
                <a onClick={this.positionMatch} style={this.state.posStyle} className="silentButton">POSITION</a>
              </div>
              <div id="colorButton" className={this.state.colorButton}>
                <a onClick={this.colorMatch} style={this.state.colorStyle} className="silentButton">COLOR</a>
              </div>
            </div>
          </div>
        </div>
        <Link to="/home"><img className="gameHomeBtn whiteLogo" src="../../images/CortexLogo3.png"/></Link>
      </div>
    );
  }
});

var noStyle = {}
var pushStyle = {
  backgroundColor: '#008C82'
}

var standardStyle = {
  backgroundColor: "transparent",
  border: "3px solid #01B6A7"
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

module.exports = SilentMode
