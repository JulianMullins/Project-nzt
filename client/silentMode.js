var React = require('react');
var GameTimer = require('./gameTimer');

//COLLECTION OF GLOBAL VARIABLES TO MAKE EVERYONES LIFE EASIER
//create global variable for reaction counter
var reactionStart
//global variable for keeping reaction times
//note: all reactin times for correct hits stored as array for stats (max,min,avg)
var reactionTimes=[];
//global variable for game score (saved once time runs out)
var gameScore

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
      miss: false,
      alert: " ",
      overlay: true,
      initialTimer: 3,
      N: 1,
      pressed: false,
      tempuser: true
      //mode: this.props.mode
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
      this.positionAndColor();
    }
  },
  positionAndColor: function() {
    var positionQueue = [];
    var colorQueue = [];
    var timeTilPositionMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeTilColorMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timekeeper = 0;
    var iterations = setInterval(function() {
      timekeeper++;
    if (!this.state.miss || this.state.pressed) {
        this.setState({positionMatch: false, colorMatch: false, miss: false, alert: " "});
      }
      if (this.state.miss) {
        this.setState({positionMatch: false, colorMatch: false, miss: false, alert: "Missed a match"});
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5
          });
        }
      }

      this.setState({pressed: false});
      if (timeTilPositionMatch === 0) {
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
        this.setState({colorMatch: true, miss: true})
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

      reactionStart=Date.now()
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
      if (timekeeper === 60) {
        gameScore=this.state.score;
        console.log(gameScore,'game score')
        console.log(reactionTimes, 'reaction times')
        clearInterval(iterations);
      }
    }.bind(this), 2000);
  },
  positionMatch: function() {
    if (this.state.pressed) {
      return;
    }
    else if (this.state.positionMatch && !this.state.colorMatch) {
      //getting reaction time of correct match
      var reactionEnd=Date.now();
      reactionTimes.push(reactionEnd-reactionStart);
      this.setState({
        score: this.state.score + 10,
        miss: false,
        alert: "Good job",
        pressed: true
      });
    } else {
      if (this.state.score !== 0) {
        this.setState({
          score: this.state.score - 5,
          alert: "Not a match",
          pressed: true
        });
      } else {
        this.setState({alert: "Not a match", pressed: true});
      }
    }
  },
  colorMatch: function() {
    if (this.state.pressed) {
      return;
    }
    else if (this.state.colorMatch && !this.state.positionMatch) {
      //reaction time of correct match
      var reactionEnd=Date.now();
      reactionTimes.push(reactionEnd-reactionStart);
      this.setState({
        score: this.state.score + 10,
        miss: false,
        alert: "Good job",
        pressed: true
      });
    } else {
      if (this.state.score !== 0) {
        this.setState({
          score: this.state.score - 5,
          alert: "Not a match",
          pressed: true
        });
      } else {
        this.setState({alert: "Not a match", pressed: true});
      }
    }
  },
  doubleMatch: function() {
    if (this.state.pressed) {
      return;
    }
    else if (this.state.colorMatch && this.state.positionMatch) {
      //reaction time of correct match
      var reactionEnd=Date.now();
      reactionTimes.push(reactionEnd-reactionStart);
      this.setState({
        score: this.state.score + 10,
        miss: false,
        alert: "Good job",
        pressed: true
      });
    } else {
      if (this.state.score !== 0) {
        this.setState({
          score: this.state.score - 5,
          alert: "Not a match",
          pressed: true
        });
      } else {
        this.setState({alert: "Not a match", pressed: true});
      }
    }
  },
  render: function() {
    // var overlay = this.state.overlay
    //   ? (
    //     <div className="overlay">
    //       <center>
    //         <a className="btn">{this.state.initialTimer}</a>
    //       </center>
    //     </div>
    //   )
    //   : '';
    return (
      <div className="gameContainer">
        <h2>Silent</h2>
        <div className="gameHeading">
          <div className="gameScore silentScore">
            <b>Score: {this.state.score}</b>
          </div>
          <GameTimer timeStyle={{
            'color': "#7CD9D2"
          }}></GameTimer>
        </div>
        <div className="gameRow">
          <div className="gameSquare" style={this.state.style[0]}></div>
          <div className="gameSquare" style={this.state.style[1]}></div>
          <div className="gameSquare" style={this.state.style[2]}></div>
        </div>
        <div className="gameRow">
          <div className="gameSquare" style={this.state.style[3]}></div>
          <div className="gameSquare" style={this.state.style[4]}></div>
          <div className="gameSquare" style={this.state.style[5]}></div>
        </div>
        <div className="gameRow">
          <div className="gameSquare" style={this.state.style[6]}></div>
          <div className="gameSquare" style={this.state.style[7]}></div>
          <div className="gameSquare" style={this.state.style[8]}></div>
        </div>
        <div className="scoreAlert">
          {this.state.alert}
        </div>
        <div className="gameButtonsContainer silentMode">
          <a onClick={this.positionMatch}>POSITION</a>
          <a onClick={this.doubleMatch}>BOTH</a>
          <a onClick={this.colorMatch}>COLOR</a>
        </div>
      </div>
    );
  }
});


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

module.exports = SilentMode