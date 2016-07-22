var React = require('react');
var GameTimer = require('./gameTimer');

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
var timer;

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
      overlay: true,
      initialTimer: 3,
      N: this.props.params.n,
      posPressed: false,
      soundPressed: false,
      posStyle: noStyle,
      soundStyle: noStyle,
      keepScore: false,
      tempUser: true,
      gameId: null
    }
  },
  componentDidMount: function() {
    timer = setInterval(this.timer, 1000);

    fetch('/startGame/' + this.state.mode + '/' + this.state.N, {method: 'post'}).then(function(response) {
      return response.json();
    }).then(function(response) {
      this.setState({tempUser: response.tempUser, gameId: response.gameId})
    }.bind(this))
    window.onkeyup = function(e) {
      if (e.keyCode == 37) {
        this.positionMatch();
      }
      if (e.keyCode == 39) {
        this.soundMatch();
      }
    }.bind(this)
  },
  componentWillUnmount: function() {
    clearInterval(iterations);
    clearInterval(timer);
  },
  timer: function() {
    this.setState({
      initialTimer: this.state.initialTimer - 1
    });
    if (this.state.initialTimer === 2) {
      this.positionAndSound()
    }
    if (this.state.initialTimer === 0) {
      this.setState({overlay: false});
      clearInterval(timer);
    }
  },
  positionAndSound: function() {
    var positionQueue = [];
    var soundQueue = [];
    var timeTilPositionMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeTilSoundMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeKeeper = 0;

    iterations = setInterval(function() {
      timeKeeper++;
      if (this.state.keepScore && !(this.state.soundMatch || this.state.positionMatch)) {
        reactionTimes.push(reactionEnd - reactionStart);
        reactionEnd = null;
        this.setState({
          score: this.state.score + 10,
          alert: 'Good job',
        });
      } else if (!this.state.keepScore && (this.state.posPressed || this.state.soundPressed)) {
        this.setState({alert: "Not a match"})
        reactionEnd = null;
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5,
          });
        }
      } else if (this.state.soundMatch || this.state.positionMatch) {
        this.setState({alert: "Missed a match"});
        reactionEnd = null;
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5,
          });
        }
      }
      this.setState({
        keepScore: false,
        positionMatch: false,
        soundMatch: false,
        posPressed: false,
        soundPressed: false,
        posStyle: noStyle,
        soundStyle: noStyle
      });
      setTimeout(function() {
        this.setState({alert: ' '});
      }.bind(this), 800);

      if (timeTilPositionMatch === 0) {
        this.setState({positionMatch: true, keepScore: true})
        //reset position portion
        timeTilPositionMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextPosition = positionQueue[0];
        positionQueue.push(nextPosition);
        positionQueue.splice(0, 1);
        var pMatch = true;
      }
      //case 2: color match
      if (timeTilSoundMatch === 0) {
        this.setState({soundMatch: true, keepScore: true})
        //reset position portion
        timeTilSoundMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextSound = soundQueue[0];
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
        // resize array to N: color
        positionQueue.push(nextPosition);
        if (positionQueue.length > this.state.N) {
          positionQueue.splice(0, 1);
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
      var audio = new Audio('./audio/' + (nextSound + 1) + '.wav ');
      audio.play();
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
      if (timeKeeper === 60) {
        clearInterval(iterations);
        setTimeout(function() {
          gameScore = this.state.score;
          console.log(gameScore, 'game score')
          console.log(reactionTimes, 'reaction times')
        }.bind(this), 2000)

      }
    }.bind(this), 2000);
  },
  positionMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.positionMatch) {
      if (!reactionEnd) {
        reactionEnd = Date.now();
      }
    }
    this.setState({
      positionMatch: !this.state.positionMatch,
      posPressed: true,
      posStyle: pushStyle
    });
  },
  soundMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.soundMatch) {
      if (!reactionEnd) {
        reactionEnd = Date.now();
      }
    }
    this.setState({
      soundMatch: !this.state.soundMatch,
      soundPressed: true,
      soundStyle: pushStyle
    });
  },
  render: function() {
    var overlay = this.state.overlay
      ? (
        <div className="overlay">
          <center>
            <a className="btn">{this.state.initialTimer}</a>
          </center>
        </div>
      )
      : '';

    var scoreAlert;
    if (this.state.alert === "Good job") {
      scoreAlert = <div className="scoreAlertPositive">
        {this.state.alert}
      </div>
    } else if (this.state.alert === "Not a match" || this.state.alert === "Missed a match") {
      scoreAlert = <div className="scoreAlertNegative">
        {this.state.alert}
      </div>
    } else {
      scoreAlert = <div></div>
    }

    return (
      <div className="gameContainer classicContainer">
        {overlay}
        <h1 className="classic">Classic</h1>
        <div className="gameHeading">
          <div className="gameScore">
            <h2 className="classic">Score: {this.state.score}</h2>
          </div>
          <GameTimer timeStyle={{
            'color': "#F13542"
          }}></GameTimer>
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
        <div className="scoreAlert">
          {scoreAlert}
        </div>
        <div className="gameButtonsContainer classicBackground">
          <a onClick={this.positionMatch} style={this.state.posStyle}>POSITION</a>
          <a onClick={this.soundMatch} style={this.state.soundStyle}>SOUND</a>
        </div>
      </div>
    );
  }
});

var noStyle = {}

var pushStyle = {
  color: 'black'
}

var standardStyle = {
  backgroundColor: "#BFBFBF"
}

var newStyle = {
  backgroundColor: "#F13542"
}

module.exports = ClassicMode
