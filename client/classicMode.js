var React = require('react');
var GameTimer = require('./gameTimer');

//COLLECTION OF GLOBAL VARIABLES TO MAKE EVERYONES LIFE EASIER
//create global variable for reaction counter
var reactionStart
//global variable for keeping reaction times
//note: all reactin times for correct hits stored as array for stats (max,min,avg)
var reactionTimes = [];
//global variable for game score (saved once time runs out)
var gameScore

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
      N: 1,
      posPressed: false,
      soundPressed: false,
      keepScore: false,
      tempuser: true
    }
  },
  componentDidMount: function() {
    setInterval(this.timer, 1000);
    // fetch('/startGame/'+this.state.mode+'/'+this.state.N, {
    //  method: 'post'
    // });
  },
  timer: function() {
    this.setState({
      initialTimer: this.state.initialTimer - 1
    });
    if (this.state.initialTimer === 0) {
      this.setState({overlay: false});
      this.positionAndSound();
    }
  },
  positionAndSound: function() {
    var positionQueue = [];
    var soundQueue = [];
    var timeTilPositionMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeTilSoundMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeKeeper = 0;

    var iterations = setInterval(function() {
      timeKeeper++;

      console.log(timeTilPositionMatch, timeTilSoundMatch);
      if (this.state.keepScore && !(this.state.positionMatch || this.state.soundMatch)) {
        this.setState({
          score: this.state.score + 10,
          alert: 'Good job'
        })
      } else if (!this.state.keepScore && (this.state.posPressed || this.state.soundPressed)) {
        this.setState({alert: "Not a match"});
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5
          });
        }
      } else if (this.state.soundMatch || this.state.positionMatch) {
        this.setState({alert: "Missed a match"});
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5
          });
        }
      }

      this.setState({keepScore: false, positionMatch: false, soundMatch: false, posPressed: false, soundPressed: false});
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
      var audio = new Audio('./audio/' + (nextSound + 1) + '.wav');
      audio.play();
      this.state.style[nextPosition] = newStyle[0];
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
        gameScore = this.state.score;
        console.log(gameScore, 'game score')
        console.log(reactionTimes, 'reaction times')
        clearInterval(iterations);
      }
    }.bind(this), 2000);
  },
  positionMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.positionMatch) {
      var reactionEnd = Date.now();
      reactionTimes.push(reactionEnd - reactionStart);
    }
    this.setState({
      positionMatch: !this.state.positionMatch,
      posPressed: true
    });
  },
  soundMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.soundMatch) {
      var reactionEnd = Date.now();
      reactionTimes.push(reactionEnd - reactionStart);
    }
    this.setState({
      soundMatch: !this.state.soundMatch,
      soundPressed: true
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

    var posButtonStyle = this.state.posPressed
      ? {
        backgroundColor: 'black'
      }
      : {};
    var soundButtonStyle = this.state.soundPressed
      ? {
        backgroundColor: 'black'
      }
      : {};

    return (
      <div className="gameContainer classicContainer">
        {overlay}
        <h1 className="classicScore">Classic</h1>
        <div className="gameHeading">
          <div className="gameScore">
            <h2 className="classicScore">Score: {this.state.score}</h2>
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
        <div className="gameButtonsContainer classicMode">
          <a onClick={this.positionMatch} style={posButtonStyle}>POSITION</a>
          <a onClick={this.soundMatch} style={soundButtonStyle}>SOUND</a>
        </div>
      </div>
    );
  }
})

var standardStyle = {
  backgroundColor: "#BFBFBF"
}

var newStyle = [
  {
    backgroundColor: '#DBFF33'
  }, {
    backgroundColor: '#B15CCB'
  }, {
    backgroundColor: '#5CCBAF'
  }, {
    backgroundColor: '#5CCD93'
  }, {
    backgroundColor: '#87CD5C'
  }, {
    backgroundColor: '#D3A43F'
  }, {
    backgroundColor: '#D3563F'
  }, {
    backgroundColor: '#3F49D3'
  }, {
    backgroundColor: '#C91A83'
  }
]

module.exports = ClassicMode
