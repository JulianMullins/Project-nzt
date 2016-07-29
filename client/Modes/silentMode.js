var React = require('react');
var GameTimer = require('./gameTimer');
var SilentStartOverlay = require('./gameStartOverlay').SilentStartOverlay;
var axios = require('axios')

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
var currentScore;
var matchCount = 0; //total matches in game
var matchHit = 0; ///ones user gets

var SilentMode = React.createClass({
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
      score: 0,
      alert: " ",
      overlay: true,
      N: parseInt(this.props.params.n),
      posPressed: false,
      colorPressed: false,
      colorStyle: noStyle,
      posStyle: noStyle,
      keepScore: false,
      tempUser: true,
      gameId: null,
      mode: 'silent'
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
    //console.log("component mounted")
    // fetch('/startGame/'+this.state.mode+'/'+this.state.N, {
    //  method: 'post'
    // });
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
  positionAndColor: function() {
    console.log(this.state, 'state')
    var positionQueue = [];
    var colorQueue = [];
    var timeTilPositionMatch = parseInt((Math.random() * 5) + this.state.N);
    var timeTilColorMatch = parseInt((Math.random() * 5) + this.state.N);
    var timeKeeper = 0;

    iterations = setInterval(function() {
      timeKeeper++;
      if (this.state.keepScore && !(this.state.colorMatch || this.state.positionMatch)) {
        matchCount += 1;
        matchHit += 1;
        reactionTimes.push(reactionEnd - reactionStart);
        currentScore = ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2);
        fullScore += parseFloat(currentScore);
        console.log(fullScore)
        reactionEnd = null;
        this.setState({
          score: this.state.score + parseInt(currentScore),
          alert: 'Good job',
          posStyle: noStyle,
          colorStyle: noStyle
        });
      } else if (!this.state.keepScore && (this.state.posPressed || this.state.colorPressed)) {
        this.setState({alert: "Not a match"})
        matchHit -= 1;
        reactionEnd = null;
        if ((this.state.score - 5) >= 0) {
          fullScore -= 5;
          currentScore = 5;
          this.setState({
            score: this.state.score - 5,
            posStyle: noStyle,
            colorStyle: noStyle
          });
        } else {
          fullScore = 0;
          currentScore = this.state.score;
          this.setState({score: 0});
        }
      } else if (this.state.keepScore && (this.state.colorMatch || this.state.positionMatch)) {
        this.setState({alert: "Missed a match"});
        matchCount += 1;
        reactionEnd = null;
        if ((this.state.score - 5) >= 0) {
          fullScore -= 5;
          currentScore = 5;
          this.setState({
            score: this.state.score - 5,
            posStyle: noStyle,
            colorStyle: noStyle
          });
        } else {
          fullScore = 0;
          currentScore = this.state.score;
          this.setState({score: 0});
        }
      }
      this.setState({
        keepScore: false,
        positionMatch: false,
        colorMatch: false,
        posPressed: false,
        colorPressed: false,
        posStyle: noStyle,
        colorStyle: noStyle
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
      if (timeTilColorMatch === 0) {
        this.setState({colorMatch: true, keepScore: true})
        //reset position portion
        timeTilColorMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextColor = colorQueue[0];
        colorQueue.push(nextColor);
        colorQueue.splice(0, 1);
        var cMatch = true;
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

      reactionStart = Date.now()
      this.state.style[nextPosition] = newStyle[nextColor];
      this.setState({style: this.state.style});
      setTimeout(function() {
        this.state.style[nextPosition] = standardStyle;
        this.setState({style: this.state.style});
        timeTilPositionMatch--;
        timeTilColorMatch--;
        cMatch = false;
        pMatch = false;
      }.bind(this), 800);

      ////////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////
      //RUTH THIS IS WHERE THE GAME ENDS////////////////
      if (timeKeeper === 60) {
        clearInterval(iterations);
        setTimeout(function() {
          //console.log(reactionTimes, 'reaction times')
          //console.log(this.state)
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
        /////////////////////////////////////////////////////////////////////

      }
    }.bind(this), 2000);
  },
  positionMatch: function() {
    if (this.state.posPressed) {
      return;
    }
    if (this.state.positionMatch) {
      //getting reaction time of correct match
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
  colorMatch: function() {
    if (this.state.colorPressed) {
      return;
    }
    if (this.state.colorMatch) {
      //reaction time of correct match
      if (!reactionEnd) {
        reactionEnd = Date.now();
      }
    }
    this.setState({
      colorMatch: !this.state.colorMatch,
      colorPressed: true,
      colorStyle: pushStyle
    });
  },
  render: function() {
    var overlay = this.state.overlay
      ? (<SilentStartOverlay click={this.startGame}/>)
      : '';

    var posButtonStyle = this.state.posPressed
      ? {
        backgroundColor: 'black'
      }
      : {};
    var colorButtonStyle = this.state.colorPressed
      ? {
        backgroundColor: 'black'
      }
      : {};

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
          color: 'green'
        }}>+{parseInt(currentScore)}</h2>
      )
    } else if (this.state.alert === "Not a match" || this.state.alert === "Missed a match") {
      scoreAlert = (
        <div className="scoreAlertNegative">
          {this.state.alert}
        </div>
      )
      if (currentScore !== 0) {
        scoreUpdate = (
          <h2 style={{
            color: 'red'
          }}>-{currentScore}</h2>
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
          'color': "#7CD9D2"
        }}></GameTimer>
      );

    return (
      <div className="gameContainer">
        {overlay}
        <div className="gameFullHeader">
          <span className="gameTitle">
            <h1 className="silent modeTitle">Silent</h1>
            <h1 className="silent nTitle">(N={this.state.N})</h1>
          </span>
          <div className="gameHeading">
            <div className="gameScore silent">
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
            <a onClick={this.positionMatch} style={this.state.posStyle} className="silentButton">POSITION</a>
            <a onClick={this.colorMatch} style={this.state.colorStyle} className="silentButton">COLOR</a>
          </div>
        </div>
      </div>
    );
  }
});

var noStyle = {}
var pushStyle = {
  backgroundColor: '#319B93',
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

module.exports = SilentMode
