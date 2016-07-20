var React = require('react');
var GameTimer = require('./gameTimer');

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
      posMatch: false,
      score: 0,
      miss: false,
      alert: " ",
      overlay: true,
      initialTimer: 3,
      N: 1,
      pressed: false,
      // modeMultiplier: modeMultiplier[this.props.mode],
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
      <div className="gameContainer relaxContainer">
        {overlay}
        <h1>Relaxed</h1>
        <div className="gameHeading">
          <div className="gameScore relaxedScore">
            <h2>Score: {this.state.score}</h2>
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
        <div className="gameButtonsContainer relaxedMode">
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

module.exports = RelaxedMode