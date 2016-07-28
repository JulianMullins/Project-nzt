var React = require('react');
var GameTimer = require('./gameTimer');
var RelaxedStartOverlay = require('./gameStartOverlay').RelaxedStartOverlay;

var axios = require('axios');
axios.defaults.baseURL = process.env.url;

//COLLECTION OF GLOBAL VARIABLES TO MAKE EVERYONES LIFE EASIER
//create global variable for reaction counter
var reactionStart;
//global variable for keeping reaction times
//note: all reactin times for correct hits stored as array for stats (max,min,avg)
var reactionTimes = [];
//global variable for game score (saved once time runs out)
var gameScore;
var iterations;
var fullScore=0;
var currentScore;

var RelaxedMode = React.createClass({
  getInitialState: function() {
    console.log("getting initial state")
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
      N: parseInt(this.props.params.n),
      posPressed: false,
      posStyle: noStyle,
      // modeMultiplier: modeMultiplier[this.props.mode],
      tempUser: true,
      gameId: null,
      mode: 'relaxed',
      modeMultiplier: 1,
      penalty: 0,
      positivePoints: 0,
      userId:null
    }
  },
  componentDidMount: function() {
    axios.post('/startGame/' + this.state.mode + '/' + this.state.N)
    .then(function(response) {
      console.log("start game posted", response)
      this.setState({
        tempUser: response.data.tempUser, 
        gameId: response.data.gameId, 
        modeMultiplier: response.data.modeMultiplier, 
        penalty: response.data.penalty, 
        positivePoints: response.data.positivePoints,
        userId:response.data.userId
      });
      console.log(this.state)
      console.log("game posted")
    
      axios.get('/isUser')
      .then(function(response){
        console.log("isuser data: "+response.data)
      })

    }.bind(this))



    console.log("component mounted")
  },
  componentWillUnmount: function() {
    clearInterval(iterations);
  },
  enableKeys: function() {
    window.onkeyup = function(e) {
      if (e.keyCode == 38) {
        this.posMatch();
      }
    }.bind(this);
  },
  startGame: function() {

    axios.get('/isUser')
      .then(function(response){
        console.log(response.data)
      })

    this.setState({overlay: false});
    this.position();
    this.enableKeys();
  },
  position: function() {
    var posQueue = [];
    var timeTilPosMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeKeeper = 60;

    iterations = setInterval(function() {
      timeKeeper--;

      if (this.state.keepScore && !this.state.posMatch) {
        currentScore=((2000-reactionTimes[reactionTimes.length-1])/100).toFixed(2);
        fullScore+=parseFloat(currentScore);
        this.setState({
          alert: "Good job",
          score: this.state.score + parseInt(currentScore),
          posStle: noStyle
        });
      } else if (!this.state.keepScore && this.state.posPressed) {
        this.setState({alert: 'Not a match'});
        if ((this.state.score-5) >= 0) {
          currentScore=5;
          this.setState({
            score: this.state.score - 5,
            posStyle: noStyle
          });
        }
        else{
          currentScore=this.state.score
          this.setState({
            score: 0
          });
        }
      } else if (this.state.keepScore && this.state.posMatch) {
        this.setState({alert: "Missed a match"});
        if ((this.state.score-5) >= 0) {
          currentScore=5
          this.setState({
            score: this.state.score - 5,
            posStyle: noStyle
          });
        }
        else{
          currentScore=this.state.score;
          this.setState({
            score: 0
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
      if (timeKeeper === 50) {
        //give gameScore variable the final score
        console.log(reactionTimes, 'reaction times')
        clearInterval(iterations);
        console.log(this.state)
        console.log(fullScore)
        axios.post('/gameEnd', {
          gameId: this.state.gameId,
          score: fullScore,
          reactionTimes: reactionTimes,
          userId: this.state.userId

        }).then(function(response) {
          console.log('end game posted')
          // if(response.data.success){
          //   this.props.history.push('/gameOver');
          // }
          this.props.history.push('/gameOver');
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
      ? (<RelaxedStartOverlay click={this.startGame}/>)
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
            color: '#F13542'
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
          'color': "#01B6A7"
        }}></GameTimer>
      );

    return (
      <div className="gameContainer">
        {overlay}
        <div className="gameFullHeader">
          <span className="gameTitle">
            <h1 className="relaxed modeTitle">Relaxed</h1>
            <h1 className="relaxed nTitle">(N={this.state.N})</h1>
          </span>
          <div className="gameHeading">
            <div className="gameScore relaxed">
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
          <div className="gameButtonsContainer relaxedBackground">
            <a onClick={this.posMatch} style={this.state.posStyle}>POSITION</a>
          </div>
        </div>
      </div>
    );
  }
})

var noStyle = {}

var pushStyle = {
  color: 'rgba(0, 0, 0, .65)',
  boxShadow: '0 0'
}

var standardStyle = {
  backgroundColor: "#BFBFBF"
}

var newStyle = {
  backgroundColor: "#01B6A7"
}

module.exports = RelaxedMode
