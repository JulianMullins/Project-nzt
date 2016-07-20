var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;

var MenuOverlay = require('./menuOverlay');
var LoginOverlay = require('./loginOverlay');
var RegisterOverlay = require('./registerOverlay');
var Mainmenu = require('./Mainmenu');
var GameOverOverlay = require('./GameOverOverlay');
var Levels = require('./levels').Levels;

var GameTimer = React.createClass({
  getInitialState: function() {
    return {seconds: 120}
  },
  componentDidMount: function() {
    setTimeout(function() {
      this.setState({
        interval: setInterval(this.timerSecs, 1000)
      });
    }.bind(this), 3000);
  },
  timerSecs: function() {
    this.setState({
      seconds: this.state.seconds - 1
    });
    if (this.state.seconds === 0) {
      clearInterval(this.state.interval);
    }
  },
  render: function() {
    console.log("Style: ", this.props.timeStyle);
    return (
      <div className="timerContainer">
        <h1 className="gameTimer" style={this.props.timeStyle}>{Math.floor(this.state.seconds / 60)}:{("0" + this.state.seconds % 60).slice(-2)}</h1>
      </div>
    )
  }
});

var Relaxed = React.createClass({
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
      score: 0,
      miss: false,
      alert: " ",
      overlay: true,
      initialTimer: 3,
      N: 1,
      pressed: false,
      modeMultiplier: modeMultiplier[this.props.mode],
      tempUser: true
    }
  },
  componentDidMount: function() {
    setInterval(this.timer, 1000);

    fetch('/startGame/' + this.state.mode + '/' + this.state.N, {method: 'post'}).then(function(response) {
      return response.json();
    }).then(function(response) {
      if (!response.tempUser) {
        this.setState({tempUser: false})
      }
    })

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
      this.position();
    }
  },
  position: function() {
    var posQueue = [];
    var timeTilPosMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeKeeper = 0;

    var iterations = setInterval(function() {
      timeKeeper += 1;
      if (!this.state.miss || this.state.pressed) {
        this.setState({posMatch: false, miss: false, alert: " "});
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
        var nextPos = posQueue[0];
        posQueue.push(nextPos);
        posQueue.splice(0, 1);

        // set color for 800
        this.state.style[nextPos] = newStyle[0];
        this.setState({style: this.state.style, posMatch: true, miss: true});
        setTimeout(function() {
          this.state.style[nextPos] = standardStyle;
          this.setState({style: this.state.style});
        }.bind(this), 800);
      }
      if (timekeeper === 60) {
        console.log('over')
        clearInterval(iterations);
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
        <h2>Relaxed</h2>
        <div className="gameHeading">
          <div className="gameScore relaxedScore">
            <b>Score: {this.state.score}</b>
          </div>
          <GameTimer timeStyle={{
            'color': "#01B6A7"
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
        <div className="gameButtonsContainer relaxedMode">
          <a onClick={this.posMatch}>POSITION</a>
        </div>
      </div>
    );
  }
})

var Classic = React.createClass({
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

var Silent = React.createClass({
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
        <div className="gameButtonsContainer">
          <a onClick={this.positionMatch}>POSITION</a>
          <a onClick={this.doubleMatch}>BOTH</a>
          <a onClick={this.colorMatch}>COLOR</a>
        </div>
      </div>
    );
  }
});

var Advanced = React.createClass({
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

    setInterval(function() {
      console.log(timeTilPositionMatch, timeTilColorMatch, timeTilSoundMatch);

      if (!this.state.miss || this.state.pressed) {
        this.setState({colorMatch: false, soundMatch: false, positionMatch: false, miss: false, alert: " "});
      }
      if (this.state.miss) {
        this.setState({colorMatch: false, soundMatch: false, positionMatch: false, miss: false, alert: "Missed a match"});
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5
          });
        }
      }

      this.setState({pressed: false});

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
      audio.play();
      this.setState({style: this.state.style, miss: true});
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
    }.bind(this), 2000);
  },
  colorMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.colorMatch && !this.state.positionMatch && !this.state.soundMatch) {
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
  positionMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (!this.state.colorMatch && this.state.positionMatch && !this.state.soundMatch) {
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
  soundMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (!this.state.colorMatch && !this.state.positionMatch && this.state.soundMatch) {
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
  colorAndSoundMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.colorMatch && !this.state.positionMatch && this.state.soundMatch) {
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
  colorAndPositionMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.colorMatch && this.state.positionMatch && !this.state.soundMatch) {
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
  soundAndPositionMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.colorMatch && !this.state.positionMatch && !this.state.soundMatch) {
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
  tripleMatch: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.colorMatch && this.state.positionMatch && !this.state.soundMatch) {
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
        <h2>Advanced</h2>
        <div className="gameHeading">
          <div className="gameScore advancedScore">
            <b>Score: {this.state.score}</b>
          </div>
          <GameTimer timeStyle={{
            'color': "#F1BA03"
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
        <div className="gameButtonsContainer advancedMode">
          <a onClick={this.soundMatch}>SOUND</a>
          <a onClick={this.soundAndPositionMatch}>BOTH</a>
          <a onClick={this.positionMatch}>POSITION</a>
          <a onClick={this.tripleMatch}>ALL</a>
          <a onClick={this.colorAndPositionMatch}>BOTH</a>
          <a onClick={this.colorMatch}>COLOR</a>
          <a onClick={this.colorAndSoundMatch}>SOUND AND COLOR</a>
        </div>
      </div>
    );
  }
});

///Taylor: style sheets for changing colors on timer
var standardStyle = {
  backgroundColor: "#BFBFBF"
}

var relaxedStyle = {
  backgroundColor: "#01B6A7"
}

var silentStyle = {
  backgroundColor: "#7CD9D2"
}

var advancedStyle = {
  backgroundColor: "#F1BA03"
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

ReactDOM.render(
  <Mainmenu/>, document.getElementById('root'));

// ReactDOM.render(
//   <Silent/>, document.getElementById('root'));
