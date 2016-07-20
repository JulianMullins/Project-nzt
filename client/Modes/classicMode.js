var React = require('react');
var GameTimer = require('./gameTimer');

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
      posMatch: false,
      soundMatch: false,
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
      this.positionAndSound();
    }
  },
  positionAndSound: function() {
    var positionQueue = [];
    var soundQueue = [];
    var timeTilPosMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeTilSoundMatch = parseInt((Math.random() * 5) + 2 + this.state.N);

    setInterval(function() {
      if (!this.state.miss || this.state.pressed) {
        this.setState({posMatch: false, soundMatch: false, miss: false, alert: " "});
      }
      if (this.state.miss) {
        this.setState({miss: false, alert: "Missed a match"});
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5
          });
        }
      }

      this.setState({pressed: false});

      console.log('pos: ', timeTilPosMatch, 'sound: ', timeTilSoundMatch);
      // checking match for position
      if (timeTilPosMatch > 0) {
        // pick a non-matching next number while interval is not 0
        var nextPos = parseInt(Math.random() * 9);
        while (nextPos == positionQueue[0]) {
          nextPos = parseInt(Math.random() * 9);
        }

        // resize array to N
        positionQueue.push(nextPos);
        if (positionQueue.length > this.state.N) {
          positionQueue.splice(0, 1);
        }

        // set color for 800
        this.state.style[nextPos] = newStyle[0];
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
        var nextPos = positionQueue[0];
        positionQueue.push(nextPos);
        positionQueue.splice(0, 1);

        // set color for 800
        this.state.style[nextPos] = newStyle[0];
        this.setState({style: this.state.style, posMatch: true, miss: true});
        setTimeout(function() {
          this.state.style[nextPos] = standardStyle;
          this.setState({style: this.state.style});
        }.bind(this), 800);
      }

      // checking match for sound
      if (timeTilSoundMatch > 0) {
        // pick a non-matching next number while interval is not 0
        var nextSound = parseInt(Math.random() * 9);
        while (nextSound == soundQueue[0]) {
          nextSound = parseInt(Math.random() * 9);
        }

        // resize array to N
        soundQueue.push(nextSound);
        if (soundQueue.length > this.state.N) {
          soundQueue.splice(0, 1);
        }

        // set sound to play
        var audio = new Audio('./audio/' + (nextSound + 1) + '.wav');
        audio.play();

        // lower interval
        timeTilSoundMatch--;
      } else {
        // pick new interval
        timeTilSoundMatch = parseInt((Math.random() * 5) + 2);

        // guaranteed match
        var nextSound = soundQueue[0];
        soundQueue.push(nextSound);
        soundQueue.splice(0, 1);

        // set sound to play
        var audio = new Audio('./audio/' + (nextSound + 1) + '.wav');
        audio.play();
        this.setState({soundMatch: true, miss: true});
      }
    }.bind(this), 2000);
  },
  posMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.posMatch) {
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
        this.setState({alert: "Not a match"});
      }
    }
  },
  soundMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.soundMatch && !this.state.posMatch) {
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
        this.setState({alert: "Not a match"});
      }
    }
  },
  posAndSoundMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.posMatch && this.state.soundMatch) {
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
        this.setState({alert: "Not a match"});
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
    return (
      <div className="gameContainer">
        {overlay}
        <h2>Classic</h2>
        <div className="gameHeading">
          <div className="gameScore classicScore">
            <b>Score: {this.state.score}</b>
          </div>
          <GameTimer timeStyle={{
            'color': "#F13542"
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
        <div className="gameButtonsContainer classicMode">
          <a onClick={this.soundMatch}>SOUND</a>
          <a onClick={this.posAndSoundMatch}>BOTH</a>
          <a onClick={this.posMatch}>POSITION</a>
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