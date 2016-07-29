var React = require('react');
var GameTimer = require('./gameTimer');
var ClassicStartOverlay = require('./gameStartOverlay').ClassicStartOverlay;
var axios = require('axios')
var fullScore = 0;
var currentScore;
var matchCount=0; //total matches in game
var matchHit=0; ///ones user gets

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
      N: parseInt(this.props.params.n),
      posPressed: false,
      soundPressed: false,
      posStyle: noStyle,
      soundStyle: noStyle,
      keepScore: false,
      tempUser: true,
      gameId: null,
      mode: 'classic'
    }
  },
  componentDidMount: function() {
    startGameFunction(this.state.mode,this.state.N,function(err,obj){
      if(err){
        this.props.history.push('/levels/'+this.state.mode);
      }
      this.setState({
        tempUser: obj.tempUser,
        gameId: obj.gameId,
        modeMultiplier:obj.modeMultiplier,
        penalty:obj.penalty,
        positivePoints:obj.positivePoints,
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
        this.positionMatch();
      }
      if (e.keyCode == 39) {
        this.soundMatch();
      }
    }.bind(this)
  },
  startGame: function() {
    this.setState({overlay: false});
    this.positionAndSound();
    this.enableKeys();
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
        currentScore = ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2);
        fullScore += parseFloat(currentScore);
        reactionEnd = null;
        matchCount+=1;
        matchHit+=1;
        this.setState({
          score: this.state.score + parseInt(currentScore),
          alert: 'Good job'
        });
      } else if (!this.state.keepScore && (this.state.posPressed || this.state.soundPressed)) {
        this.setState({alert: "Not a match"})
        reactionEnd = null;
        matchHit-=1;
        if ((this.state.score - 5) >= 0) {
          currentScore = 5;
          this.setState({
            score: this.state.score - 5
          });
        } else {
          currentScore = this.state.score;
          this.setState({score: 0});
        }
      } else if (this.state.soundMatch || this.state.positionMatch) {
        this.setState({alert: "Missed a match"});
        reactionEnd = null;
        matchCount+=1;
        if ((this.state.score - 5) >= 0) {
          currentScore = 5;
          this.setState({
            score: this.state.score - this.state.penalty
          });
        } else {
          currentScore = this.state.score;
          this.setState({score: 0});
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

      ////////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////
      //RUTH THIS IS WHERE THE GAME ENDS///////////////////////////////////////////
      if (timeKeeper === 60) {
        clearInterval(iterations);
        setTimeout(function() {
          console.log(reactionTimes, 'reaction times')
          console.log(matchHit/matchCount, 'accuracy')
          console.log(this.state)


          endGameFunction(fullScore,reactionTimes,this.state.gameId,this.state.userId,function(success){
            if(success){
              this.props.history.push('/gameOver')
            }
          }.bind(this))

        }.bind(this), 2000)
          
////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////

      }

    }.bind(this), 2000)
  },
  //}
  //}.bind(this), 2000);
  //},
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
      ? (<ClassicStartOverlay click={this.startGame}/>)
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
          'color': "#F13542"
        }}></GameTimer>
      );

    return (
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
  backgroundColor: "#BFBFBF"
}

var newStyle = {
  backgroundColor: "#F13542"
}

module.exports = ClassicMode
