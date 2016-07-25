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
var iterations;
var timer;

var RelaxedMode = React.createClass({
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
      score: 0,
      keepScore: false,
      alert: " ",
      overlay: true,
      initialTimer: 3,
      N: this.props.params.n,
      posPressed: false,
      posStyle: noStyle,
      // modeMultiplier: modeMultiplier[this.props.mode],
      tempUser: true,
      gameId: null,
      mode: 'relaxed'
    }
  },
  componentDidMount: function() {
    timer = setInterval(this.timer, 1000);

    fetch('/startGame/' + this.state.mode + '/' + this.state.N, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(function(response) {

      return response.json();
    }).then(function(response) {
      this.setState({tempUser: response.tempUser, gameId: response.gameId})
    }.bind(this))
  },
  componentWillUnmount: function() {
    clearInterval(iterations);
    clearInterval(timer);
  },
  enableKeys: function() {
    window.onkeyup = function(e) {
      if (e.keyCode == 38) {
        this.posMatch();
      }
    }.bind(this);
  },
  timer: function() {
    this.setState({
      initialTimer: this.state.initialTimer - 1
    });
    if (this.state.initialTimer === 2) {
      this.position();
    }
    if (this.state.initialTimer === 0) {
      this.enableKeys();
      this.setState({overlay: false});
      clearInterval(timer);
    }
  },
  position: function() {
    var posQueue = [];
    var timeTilPosMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeKeeper = 0;

    iterations = setInterval(function() {
      timeKeeper++;

      if (this.state.keepScore && !this.state.posMatch) {
        this.setState({
          alert: "Good job",
          score: this.state.score + 10,
          posStle: noStyle
        });
      } else if (!this.state.keepScore && this.state.posPressed) {
        this.setState({alert: 'Not a match'});
        if (this.state.score > 0) {
          this.setState({
            score: this.state.score - 5,
            posStyle: noStyle
          });
        }
      } else if (this.state.keepScore && this.state.posMatch) {
        this.setState({alert: "Missed a match"});
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5,
            posStyle: noStyle
          });
        }
      }

      this.setState({pressed: false, keepScore: false, posMatch: false, posPressed: false, posStyle: noStyle});
      setTimeout(function() {
        this.setState({alert: ' '});
      }.bind(this), 800);
      //start reaction time counter with flash
      reactionStart = Date.now()

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

      ////////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////
      //RUTH THIS IS WHERE THE GAME ENDS///////////////////////////////////////////
      if (timeKeeper === 60) {
        //give gameScore variable the final score
        gameScore = this.state.score;
        console.log(gameScore, 'game score')
        console.log(reactionTimes, 'reaction times')
        clearInterval(iterations);

        fetch('/gameEnd', {
          method: 'post',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({gameId: this.state.gameId, score: gameScore, reactionTimes: reactionTimes})
        }).then(function(response) {
          return response.json();
        }).then(function(response) {
          //if (response.success) {
          this.props.history.push('/gameOver/' + response.score);
          //}
        }.bind(this))

      }
      ////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////
    }.bind(this), 2000);
  },
  posMatch: function() {
    if (this.state.posPressed) {
      return;
    }
    if (this.state.posMatch) {
      //if correct button pressed, use current time to find reaction time
      var reactionStop = Date.now()
      reactionTimes.push(reactionStop - reactionStart)
    }
    this.setState({
      posPressed: true,
      posMatch: !this.state.posMatch,
      posStyle: pushStyle
    })
  },
  render: function() {
    var overlay = this.state.overlay
      ? (
        <div className="overlay">
          <center>
            <a className="btn">{this.state.initialTimer}</a>
            <h4>Use the keys to press the buttons.</h4>
            <div className="key-wrapper">
              <ul className="row">
                <li className="key k38">↑</li>
              </ul>

              <ul className="row">
                <li className="key k37">←</li>
                <li className="key k40">↓</li>
                <li className="key k39">→</li>
              </ul>
            </div>
          </center>
        </div>
      )
      : '';

    var scoreAlert;
    var scoreUpdate;
    if (this.state.alert === "Good job") {
      scoreAlert = (
        <div className="scoreAlertPositive">
          {this.state.alert}
        </div>
      )
      scoreUpdate = (
        <h2 style={{
          color: '#01B6A7'
        }}>+10</h2>
      )
    } else if (this.state.alert === "Not a match" || this.state.alert === "Missed a match") {
      scoreAlert = (
        <div className="scoreAlertNegative">
          {this.state.alert}
        </div>
      )
      if (this.state.score > 0) {
        scoreUpdate = (
          <h2 style={{
            color: '#F13542'
          }}>-5</h2>
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

    return (
      <div className="gameContainer">
        {overlay}
        <span className="gameTitle">
          <h1 className="relaxed modeTitle">Relaxed</h1>
          <h1 className="relaxed nTitle">(N={this.state.N})</h1>
        </span>
        <div className="gameHeading">
          <div className="gameScore relaxed">
            <h2>Score: {this.state.score}</h2>
            {scoreUpdate}
          </div>
          <GameTimer timeStyle={{
            'color': "#01B6A7"
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
        <div className="gameButtonsContainer relaxedBackground">
          <a onClick={this.posMatch} style={this.state.posStyle}>POSITION</a>
        </div>
      </div>
    );
  }
})

var noStyle = {}

var pushStyle = {
  color: 'black'
}

var standardStyle = {
  backgroundColor: "#BFBFBF"
}

var newStyle = {
  backgroundColor: "#01B6A7"
}

module.exports = RelaxedMode
