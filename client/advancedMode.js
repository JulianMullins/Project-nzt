var React = require('react');
var GameTimer = require('./gameTimer');


//REPLACE MATCH BOOLEANS WITH ARRAY 
//CHECK FOR MATCH AFTER THE END OF EACH ROUND
//KEEP FLASHSING FOR AS LONG AS THE SQUARES DO AND THEN REMOVE
//(TO KEEP CONISTENCY ON THE EYE)
//ADJUST SCOREBOARD ACCORDINGLY 
//ESSENTIALLY 2 STATES: MATCH OR MISS

//!!!MAKE SURE TO KEEP CAREFUL TRACK OF THE ARRAY!!!



var AdvancedMode = React.createClass({
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
      score: 0,
      miss: false,
      alert: " ",
      overlay: true,
      initialTimer: 3,
      N: 1,
      colorPressed: noStyle,
      soundPressed: noStyle,
      positionPressed: noStyle,
      //color, sound, popsistion
      correct: [false, false,false],
      mode: this.props.mode
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
      this.playGame();
    }
  },
  playGame: function() {
    var positionQueue = [];
    var colorQueue = [];
    var soundQueue = [];
    var timeTilPositionMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeTilColorMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeTilSoundMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
     var timekeeper = 0;
      timekeeper++;
      //console.log(timekeeper)

    setInterval(function() {
      console.log(timeTilPositionMatch, timeTilColorMatch, timeTilSoundMatch);

      if(!this.state.correct[0] && !this.state.correct[1] && !this.state.correct[2]){
        if(!this.state.colorMatch && !this.state.positionMatch && !this.state.soundMatch){
          console.log('no matches')
        }
        else{
         console.log('missed match')
        }
      }

      // if (!this.state.miss || this.state.pressed) {
      //   this.setState({soundPressed: noStyle, colorPressed: noStyle, positionPressed: noStyle, correct: [false, false, false],
      //   colorMatch: false, soundMatch: false, positionMatch: false, miss: false, alert: " "});
      // }
      // if(this.state.correct[0]===this.state.colorMatch && this.state.correct[1]===this.state.soundMatch && this.state.correct[2]===this.state.positionMatch){
      //   console.log('match')
      // }
      // else{
      //   console.log('miss')
      //   this.setState({miss: true})
      // }
      if (this.state.miss) {
        console.log('miss')
        this.setState({soundPressed: noStyle, colorPressed: noStyle, positionPressed: noStyle, correct: [false,false,false],
        colorMatch: false, soundMatch: false, positionMatch: false, miss: false, alert: "Missed a match"});
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5
          });
        }
      }

      this.setState({pressed: noStyle, alert: " "});

      //NOT GOING TO ACTUALLY LIGHT UP COLORS UNTIL ALL IF STATEMENTS HAVE ITERATED
      //case 1: position match
      if (timeTilPositionMatch === 0) {
        console.log('position match')
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
        console.log('color match')
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
        console.log('sound match')
        this.setState({soundMatch: true, miss: true})
        //reset position portion
        timeTilSoundMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextSound = soundQueue[0];
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

      this.state.style[nextPosition] = newStyle[nextColor];
      var audio = new Audio('./audio/' + (nextSound + 1) + '.wav');
      //audio.play();
      this.setState({style: this.state.style});
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
      if (timekeeper === 60) {
        console.log('over')
        clearInterval(iterations);
      }
    }.bind(this), 2000);
  },
  colorMatch: function() {
    if (this.state.colorMatch && !this.state.positionMatch && !this.state.soundMatch) {
      this.setState({
        score: this.state.score + 10,
        miss: false,
        alert: "Good job",
        colorPressed: pushStyle
      });
    } else {
      if (this.state.score !== 0) {
        this.setState({
          score: this.state.score - 5,
          alert: "Not a match",
          colorPressed: pushStyle
        });
      } else {
        this.setState({alert: "Not a match", colorPressed: pushStyle});
      }
    }
  },
  positionMatch: function() {
    if (!this.state.colorMatch && this.state.positionMatch && !this.state.soundMatch) {
      this.setState({
        score: this.state.score + 10,
        miss: false,
        alert: "Good job",
        positionPressed: pushStyle
      });
    } else {
      if (this.state.score !== 0) {
        this.setState({
          score: this.state.score - 5,
          alert: "Not a match",
          positionPressed: pushStyle
        });
      } else {
        this.setState({alert: "Not a match", positionPressed: pushStyle});
      }
    }
  },
  soundMatch: function() {
    if (!this.state.colorMatch && !this.state.positionMatch && this.state.soundMatch) {
      this.setState({
        score: this.state.score + 10,
        miss: false,
        alert: "Good job",
        soundPressed: pushStyle
      });
    } else {
      if (this.state.score !== 0) {
        this.setState({
          score: this.state.score - 5,
          alert: "Not a match",
          soundPressed:pushStyle
        });
      } else {
        this.setState({alert: "Not a match", soundPressed: pushStyle});
      }
    }
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
    } else if (this.state.alert === "Not a match" ||
               this.state.alert === "Missed a match") {
      scoreAlert = <div className="scoreAlertNegative">
                    {this.state.alert}
                   </div>
    } else {
      scoreAlert = <div></div>
    }

    return (
      <div className="gameContainer advancedContainer">
        {overlay}
        <h1 className="advancedScore">Advanced</h1>
        <div className="gameHeading">
          <div className="gameScore">
            <h2 className="advancedScore">Score: {this.state.score}</h2>
          </div>
          <GameTimer timeStyle={{
            'color': "#F1BA03"
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
        <div className="gameButtonsContainer advancedMode">
          <a style={this.state.soundPressed} onClick={this.soundMatch}>SOUND</a>
          <a style={this.state.positionPressed} onClick={this.positionMatch}>POSITION</a>
          <a style={this.state.colorPressed} onClick={this.colorMatch}>COLOR</a>
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

module.exports = AdvancedMode