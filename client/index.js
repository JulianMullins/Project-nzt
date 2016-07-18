var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;

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
            <button onClick={this.props.facebook}>Login with Facebook</button>
            <br></br>
            <button onClick={this.props.registerScreen}>Dont have an account yet?</button>
            <br></br>
            <button onClick={this.props.back} className="back">Back</button>
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
            <input type="text" placeholder="username" name="username" id="username"></input>
            <br></br>
            <input type="text" placeholder="email" name="email" id="email"></input>
            <br />
            <input type="password" placeholder="password" name="password" id="password"></input>
            <br></br>
            <input type="password" placeholder="confirm password" name="passwordConfirm" id="passwordConfirm"></input>
            <br></br>
            <button onClick={this.props.register}>Register</button>
            <br></br>
            <button onClick={this.props.back} className="back">Already have an account?</button>
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

    //ajax post
    fetch(url+'/login', {
    	method: 'post',
    	body: JSON.stringify({
    		username: document.getElementById('username').value,
    		password: document.getElementById('password').value
    	})
    });

  },
  facebook: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: false});

    //ajax facebook get
    fetch(url+'/login/facebook', {
    	method: 'get'
    })

  },
  registerScreen: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: true})
  },
  register: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: false});

    //ajax post
    fetch(url+'/register', {
    	method: 'post',
    	body: JSON.stringify({
    		username: document.getElementById('username').value,
        email: document.getElementById('email').value,
    		password: document.getElementById('password').value,
        passwordConfirm: document.getElementById('passwordConfirm').value
    	})
    });

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
    console.log(this.state.mode);
  },
  render: function() {
    var menu = this.state.menu
      ? <MenuOverlay start={this.start} loginScreen={this.loginScreen} registerScreen={this.registerScreen}></MenuOverlay>
      : '';
    var login = this.state.login
      ? <LoginOverlay login={this.login} back={this.back} registerScreen={this.registerScreen} facebook={this.facebook}></LoginOverlay>
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

var AlertPositive = React.createClass({
  render: function() {
    return (
      <div className="scoreAlertPositive">
        <h3>Positive message</h3>
      </div>
    )
  }
});

var AlertNegative = React.createClass({
  render: function() {
    return (
      <div className="scoreAlertNegative">
        <h3>{this.props.alert}</h3>
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
      initialTimer: 3
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
    var out = [];
    setInterval(function() {
      if (!this.state.miss) {
        this.setState({match: false, miss: false, alert: " "});
      }
      if (this.state.miss) {
        if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5,
            miss: false,
            alert: "Missed a match"
          });
        } else {
          this.setState({miss: false, alert: "Missed a match"});
        }
      }

      //start with forced match command
      if (out.length === 15) {
        out.push(out[out.length - 1]);
        this.state.style[out[out.length - 1]] = newStyle;
        this.setState({style: this.state.style, match: true, miss: true});
        setTimeout(function() {
          this.state.style[out[out.length - 1]] = standardStyle;
          this.setState({style: this.state.style});
          out = []
        }.bind(this), 500);
      } else {
        out.push(parseInt(Math.random() * 9));
        this.state.style[out[out.length - 1]] = newStyle;
        this.setState({style: this.state.style});

        //pause for thinking/processing time
        if (out.length > 1) {
          if (out[out.length - 1] === out[out.length - 2]) {
            setTimeout(function() {
              this.state.style[out[out.length - 1]] = standardStyle;
              this.setState({style: this.state.style, match: true, miss: true});
              out = [];
            }.bind(this), 500);
          } else {
            setTimeout(function() {
              this.state.style[out[out.length - 1]] = standardStyle;
              this.setState({style: this.state.style});
            }.bind(this), 500);
          }
        }
        if (out.length === 1) {
          setTimeout(function() {
            this.state.style[out[out.length - 1]] = standardStyle;
            this.setState({style: this.state.style});
          }.bind(this), 500);
        }
      }
    }.bind(this), 2000)
  },
  match: function() {
    if (this.state.match) {
      this.setState({
        score: this.state.score + 10,
        miss: false,
        alert: "Good job"
      });
    } else {
      if (this.state.score !== 0) {
        this.setState({
          score: this.state.score - 5,
          alert: "Not a match"
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

    var alertMessage;
    if (this.state.alert === "Good job!") {
      alertMessage = <AlertPositive/>;
    } else if (this.state.alert === "Not a match" || this.state.alert === "Missed a match") {
      alertMessage = <AlertNegative alert={this.state.alert}/>;
    } else {
      alertMessage = <div style={{
        height: "120px"
      }}></div>;
    };

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
        {alertMessage}

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
