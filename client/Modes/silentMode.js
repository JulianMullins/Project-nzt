var React = require('react');
var GameTimer = require('./gameTimer');

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
      console.log(timekeeper)
      if (!this.state.miss || this.state.pressed) {
        this.setState({positionMatch: false, soundMatch: false, miss: false, alert: " "});
      }
      if (this.state.miss) {
        this.setState({miss: false, alert: "Missed a match", positionMatch: false, soundMatch: false});
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5
          });
        }
      }

      this.setState({pressed: false, alert: " "});
      //case 1: add both position and color match
      if (timeTilPositionMatch > 0 && timeTilColorMatch > 0) {
        // pick a non-matching next number while interval is not 0
        var nextPosition = parseInt(Math.random() * 9);
        while (nextPosition === positionQueue[0]) {
          nextPosition = parseInt(Math.random() * 9);
        }
        // pick a non-matching next number while interval is not 0
        var nextColor = parseInt(Math.random() * 9);
        while (nextColor === colorQueue[0]) {
          nextColor = parseInt(Math.random() * 9);
        }
        // resize array to N: position
        positionQueue.push(nextPosition);
        if (positionQueue.length > this.state.N) {
          positionQueue.splice(0, 1);
        }
        // resize array to N: color
        colorQueue.push(nextColor);
        if (colorQueue.length > this.state.N) {
          colorQueue.splice(0, 1);
        }
        // set color for 800
        this.state.style[nextPosition] = newStyle[nextColor];
        this.setState({style: this.state.style});
        setTimeout(function() {
          this.state.style[nextPosition] = standardStyle;
          this.setState({style: this.state.style});
        }.bind(this), 800);
        // lower interval
        timeTilPositionMatch--;
        timeTilColorMatch--; //case 2: was a position match but color still >0
      } else if (timeTilColorMatch > 0) {
        console.log('position match')
        this.setState({positionMatch: true, miss: true})
        //reset position portion
        timeTilPositionMatch = parseInt((Math.random() * 5) + 2);
        var nextPosition = positionQueue[0];
        positionQueue.push(nextPosition);
        positionQueue.splice(0, 1);
        // pick a non-matching next number while interval is not 0
        var nextColor = parseInt(Math.random() * 9);
        while (nextColor == colorQueue[0]) {
          nextColor = parseInt(Math.random() * 9);
        }
        // resize array to N: color
        colorQueue.push(nextColor);
        if (colorQueue.length > this.state.N) {
          colorQueue.splice(0, 1);
        }
        // set color for 800
        this.state.style[nextPosition] = newStyle[nextColor];
        this.setState({style: this.state.style});
        setTimeout(function() {
          this.state.style[nextPosition] = standardStyle;
          this.setState({style: this.state.style});
        }.bind(this), 800);
        // lower interval
        timeTilPositionMatch--;
        timeTilColorMatch--; //case 3: color match but position still >o
      } else if (timeTilPositionMatch > 0) {
        console.log('color match')
        this.setState({colorMatch: true, miss: true})
        //reset position portion
        timeTilColorMatch = parseInt((Math.random() * 5) + 2);
        var nextColor = colorQueue[0];
        colorQueue.push(nextColor);
        colorQueue.splice(0, 1);
        // pick a non-matching next number while interval is not 0
        var nextPosition = parseInt(Math.random() * 9);
        while (nextPosition === positionQueue[0]) {
          nextPosition = parseInt(Math.random() * 9);
        }
        // resize array to N: color
        positionQueue.push(nextPosition);
        if (positionQueue.length > this.state.N) {
          positionQueue.splice(0, 1);
        }
        // set color for 800
        this.state.style[nextPosition] = newStyle[nextColor];
        this.setState({style: this.state.style});
        setTimeout(function() {
          this.state.style[nextPosition] = standardStyle;
          this.setState({style: this.state.style});
        }.bind(this), 800);
        // lower interval
        timeTilPositionMatch--;
        timeTilColorMatch--;
      } else {
        // pick new interval
        console.log('double match')
        timeTilColorMatch = parseInt((Math.random() * 5) + 2);
        timeTilPositionMatch = parseInt((Math.random() * 5) + 2);
        this.setState({colorMatch: true, positionMatch: true, miss: true})
        // color match
        var nextColor = colorQueue[0];
        colorQueue.push(nextColor);
        colorQueue.splice(0, 1);
        //position match
        var nextPosition = positionQueue[0];
        positionQueue.push(nextPosition);
        colorQueue.splice(0, 1);
        // set color for 800
        this.state.style[nextPosition] = newStyle[nextColor];
        this.setState({style: this.state.style, match: true, miss: true});
        setTimeout(function() {
          this.state.style[nextPosition] = standardStyle;
          this.setState({style: this.state.style});
        }.bind(this), 800);
      }
      if (timekeeper === 60) {
        console.log('over')
        clearInterval(iterations);
      }
    }.bind(this), 2000);
  },
  positionMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.positionMatch && !this.state.colorMatch) {
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
    if (this.state.colorMatch && !this.state.positionMatch) {
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
    if (this.state.colorMatch && this.state.positionMatch) {
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