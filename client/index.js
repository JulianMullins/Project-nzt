var React = require('react');
var ReactDOM = require('react-dom');

var MenuOverlay = React.createClass({
  render: function() {
    return (
      <div className="overlay">
        <center>
          <a className="btn" href="" onClick={this.props.start}>Start</a>
          <a className="btn" href="" onClick={this.props.loginScreen}>Login</a>
        </center>
      </div>
    )
  }
})

var LoginOverlay = React.createClass({
  render: function() {
    return (
      <div className="overlay" id="login">
        <center>
          <form>
            <input type="text" placeholder="username"></input>
            <br></br>
            <input type="password" placeholder="password"></input>
            <br></br>
            <button onClick={this.props.login}>Login</button>
            <br></br>
            <button onClick={this.props.registerScreen}>Don't have an account yet?</button>
            <br></br>
            <button onClick={this.props.back} class="back">Back</button>
          </form>
        </center>
      </div>
    )
  }
});

var RegisterOverlay = React.createClass({
  render: function() {
    return (
      <div className="overlay" id="login">
        <center>
          <form>
            <input type="text" placeholder="username"></input>
            <br></br>
            <input type="password" placeholder="password"></input>
            <br></br>
            <input type="password" placeholder="confirm password"></input>
            <br></br>
            <button onClick={this.props.register}>Register</button>
            <br></br>
            <button onClick={this.props.back} class="back">Already have an account?</button>
          </form>
        </center>
      </div>
    )
  }
});

var Mainmenu = React.createClass({
  getInitialState: function() {
    return {
      menu: true,
      login: false,
      register: false,
      mode: {
        position: true,
        sound: true,
        color: false
      }
    }
  },
  start: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: false});
  },
  loginScreen: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: true, register: false})
  },
  login: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: false});
  },
  registerScreen: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: true})
  },
  register: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: false});
  },
  back: function(e) {
    e.preventDefault();
    this.setState({menu: true, login: false, register: false})
  },
  normalMode: function(e) {
    e.preventDefault();
    this.setState({
      mode: {
        position: true,
        sound: true,
        color: false
      }
    }, this.goToGame);
  },
  posOnly: function(e) {
    e.preventDefault();
    this.setState({
      mode: {
        position: true,
        sound: false,
        color: false
      }
    }, this.goToGame);
  },
  posAndColor: function(e) {
    e.preventDefault();
    this.setState({
      mode: {
        position: true,
        sound: false,
        color: true
      }
    }, this.goToGame);
  },
  advanced: function(e) {
    e.preventDefault();
    this.setState({
      mode: {
        position: true,
        sound: true,
        color: true
      }
    }, this.goToGame);
  },
  goToGame: function() {
    ReactDOM.render(
      <Game mode={this.state.mode}></Game>, document.getElementById('root'));
  },
  render: function() {
    var menu = this.state.menu
      ? <MenuOverlay start={this.start} loginScreen={this.loginScreen} registerScreen={this.registerScreen}></MenuOverlay>
      : '';
    var login = this.state.login
      ? <LoginOverlay login={this.login} back={this.back} registerScreen={this.registerScreen}></LoginOverlay>
      : '';
    var register = this.state.register
      ? <RegisterOverlay register={this.register} back={this.loginScreen}></RegisterOverlay>
      : '';
    return (
      <div>
        {menu}
        {login}
        {register}
        <center>
          <h1 id="title">Project NZT</h1>
        </center>
        <div className="menu">
          <a href="" className="menu-panel" onClick={this.normalMode}>
            <h2>normal</h2>
            <h3>(position, sound)</h3>
          </a>
          <a href="" className="menu-panel" onClick={this.posOnly}>
            <h2>position-only</h2>
          </a>
        </div>
        <div className="menu">
          <a href="" className="menu-panel" onClick={this.posAndColor}>
            <h2>position & color</h2>
          </a>
          <a href="" className="menu-panel" onClick={this.advanced}>
            <h2>advanced</h2>
            <h3>(color, position, sound)</h3>
          </a>
        </div>
      </div>
    );
  }
});

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
    return (
      <div className="timerContainer">
        <h1 className="gameTimer">{Math.floor(this.state.seconds / 60)}:{("0" + this.state.seconds % 60).slice(-2)}</h1>
      </div>
    )
  }
});

var Game = React.createClass({
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
      match: false,
      score: 0,
      miss: false,
      alert: " ",
      overlay: true,
      initialTimer: 3,
      N: 1,
      pressed: false
    }
  },
  componentDidMount: function() {
    setInterval(this.timer, 1000);
  },
  timer: function() {
    this.setState({
      initialTimer: this.state.initialTimer - 1
    });
    if (this.state.initialTimer === 0) {
      this.setState({overlay: false});
      this.test();
    }
  },
  test: function() {
    var queue = [];
    var timeTilMatch = parseInt((Math.random() * 5) + 2 + this.state.N);

    setInterval(function() {
      this.setState({pressed: false});
      if (!this.state.miss) {
        this.setState({match: false, miss: false, alert: " "});
      }
      if (this.state.miss) {
        this.setState({miss: false, alert: "Missed a match"});
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5
          });
        }
      }

      if (timeTilMatch > 0) {
        // pick a non-matching next number while interval is not 0
        var next = parseInt(Math.random() * 9);
        while (next == queue[0]) {
          next = parseInt(Math.random() * 9);
        }

        // resize array to N
        queue.push(next);
        if (queue.length > this.state.N) {
          queue.splice(0, 1);
        }

        // set color for 800
        this.state.style[next] = newStyle;
        this.setState({style: this.state.style});
        setTimeout(function() {
          this.state.style[next] = standardStyle;
          this.setState({style: this.state.style});
        }.bind(this), 800);

        // lower interval
        timeTilMatch--;
      } else {
        // pick new interval
        timeTilMatch = parseInt((Math.random() * 5) + 2);

        // guaranteed match
        var next = queue[0];
        queue.push(next);
        queue.splice(0, 1);

        // set color for 800
        this.state.style[next] = newStyle;
        this.setState({style: this.state.style, match: true, miss: true});
        setTimeout(function() {
          this.state.style[next] = standardStyle;
          this.setState({style: this.state.style});
        }.bind(this), 800);
      }
    }.bind(this), 2000);
  },
  match: function() {
    if (this.state.pressed) {
      return;
    }
    if (this.state.match) {
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
        <div className="gameHeading">
          <div className="gameScore">
            <b>Score: {this.state.score}</b>
          </div>
          <GameTimer></GameTimer>
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
          <a>SOUND</a>
          <a>BOTH</a>
          <a onClick={this.match}>POSITION</a>
        </div>
      </div>
    );
  }
});

///Taylor: style sheets for changing colors on timer
var standardStyle = {
  backgroundColor: "#BFBFBF"
}

var newStyle = {
  backgroundColor: 'blue'
}

// ReactDOM.render(<Game />, document.getElementById('root'));

ReactDOM.render(
  <Mainmenu/>, document.getElementById('root'));
