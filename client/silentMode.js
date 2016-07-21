var React = require('react');
var GameTimer = require('./Modes/gameTimer');

//COLLECTION OF GLOBAL VARIABLES TO MAKE EVERYONES LIFE EASIER
//create global variable for reaction counter
var reactionStart;
//global variable for keeping reaction times
//note: all reactin times for correct hits stored as array for stats (max,min,avg)
var reactionTimes = [];
//global variable for game score (saved once time runs out)
var gameScore;
var reactionEnd=null;

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
      initialTimer: 3,
      N: 1,
      posPressed: false,
      colorPressed: false,
      colorStyle: noStyle,
      posStyle: noStyle,
      keepScore: false,
      tempuser: true
    }
  },
  componentDidMount: function() {
    setInterval(this.timer, 1000);
    // fetch('/startGame/'+this.state.mode+'/'+this.state.N, {
    //  method: 'post'
    // });
      <script>
          {window.onkeyup = function(e) {
            if (e.keyCode == 37) {
              this.positionMatch();
            }
            if (e.keyCode == 39) {
              this.colorMatch();
            }
          }.bind(this)}</script>   
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
    var timeKeeper = 0;

    var iterations = setInterval(function() {
      timeKeeper++;
      if (this.state.keepScore && !(this.state.colorMatch || this.state.positionMatch)) {
        reactionTimes.push(reactionEnd-reactionStart);
        reactionEnd=null;
        this.setState({
          score: this.state.score + 10,
          alert: 'Good job',
          posStyle: noStyle, colorStyle: noStyle
        });
      } else if (!this.state.keepScore && (this.state.posPressed || this.state.colorPressed)) {
        this.setState({alert: "Not a match"})
        reactionEnd=null;
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5,
            posStyle: noStyle, colorStyle: noStyle
          });
        }
      } else if (this.state.colorMatch || this.state.positionMatch) {
        this.setState({alert: "Missed a match"});
        reactionEnd=null;
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5,
            posStyle: noStyle, colorStyle: noStyle
          });
        }
      }
      this.setState({keepScore: false, positionMatch: false, colorMatch: false, posPressed: false, colorPressed: false, 
        posStyle: noStyle, colorStyle: noStyle});
      setTimeout(function() {
        this.setState({alert: ' '});
      }.bind(this), 800);

      console.log('pos: ', timeTilPositionMatch, 'color: ', timeTilColorMatch);

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
      if (timeKeeper === 60) {
        clearInterval(iterations);
          setTimeout(function(){
          gameScore = this.state.score;
          console.log(gameScore, 'game score')
          console.log(reactionTimes, 'reaction times')
        }.bind(this),2000)
      }
    }.bind(this), 2000);
  },
  positionMatch: function() {
    console.log('pos match')
    if (this.state.posPressed) {
      return;
    }
    if (this.state.positionMatch) {
      //getting reaction time of correct match
      if(!reactionEnd){
        reactionEnd = Date.now();
      }
    }
    this.setState({positionMatch: !this.state.positionMatch, posPressed: true, posStyle: pushStyle});
  },
  colorMatch: function() {
    console.log('color press')
    if (this.state.colorPressed) {
      return;
    }
    if (this.state.colorMatch) {
      //reaction time of correct match
      if(!reactionEnd){
        reactionEnd = Date.now();
      }
    }
    this.setState({colorMatch: !this.state.colorMatch, colorPressed: true, colorStyle: pushStyle});
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
      <div className="gameContainer silentContainer">
        {overlay}
        <h1 className="silentScore">Silent</h1>
        <div className="gameHeading">
          <div className="gameScore silentScore">
            <h2>Score: {this.state.score}</h2>
          </div>
          <GameTimer timeStyle={{
            'color': "#7CD9D2"
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
        <div className="gameButtonsContainer silentMode">
          <a onClick={this.positionMatch} style={this.state.posStyle}>POSITION</a>
          <a onClick={this.colorMatch} style={this.state.colorStyle}>COLOR</a>
        </div>
      </div>
    );
  }
});

var noStyle={}
var pushStyle={color: 'black'}


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