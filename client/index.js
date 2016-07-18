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
    console.log(this.state.mode);
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
     style: [standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle],
     positionMatch: false,
     colorMatch: false,
     score: 0,
     miss: false,
     pushed: false,
     N: 1,
     alert: " "
    }   
  }, 
  componentDidMount: function() {
    setInterval(this.timer, 1000);
  },
   position: function(){
    var queue = [];
    var timeTilMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
  setInterval(function() {
  this.setState({pressed: false});
  console.log(queue, timeTilMatch);
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
  console.log(next)

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

   positionAndColor: function(){
    var positionQueue = [];
    var colorQueue = [];
    var timeTilPositionMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeTilColorMatch = parseInt((Math.random() * 5) + 2 + this.state.N);

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

//case 1: add both position and color match
  if (timeTilPositionMatch > 0 && timeTilColorMatch > 0) {
  console.log('no match')
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
  timeTilColorMatch--;
  }

  //case 2: was a position match but color still >0
  else if (timeTilColorMatch > 0) {
  console.log('position match')
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
  timeTilColorMatch--;
  }

  //case 3: color match but position still >o
  else if (timeTilPositionMatch > 0) {
  console.log('color match')

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
  }
   else {
  // pick new interval
  timeTilColorMatch = parseInt((Math.random() * 5) + 2);
  timeTilPositionMatch = parseInt((Math.random() * 5) + 2);
  console.log('double match')

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
}.bind(this), 2000);
  },
positionMatch: function(){
  if(this.state.positionMatch && !this.state.colorMatch){
    this.setState({
      score: this.state.score+10, 
      miss: false, 
      alert: "Good job"
    })
  }
  else{
    if(this.state.score!==0){
      this.setState({
      score: this.state.score-5,
      alert: "Not a match"
    })
    }
    else{
      this.setState({
      alert: "Not a match"
    })
    }
  }
},
colorMatch: function(){
  if(this.state.colorMatch && !this.state.positionMatch){
    this.setState({
      score: this.state.score+10, 
      miss: false, 
      alert: "Good job"
    })
  }
  else{
    if(this.state.score!==0){
      this.setState({
      score: this.state.score-5,
      alert: "Not a match"
    })
    }
    else{
      this.setState({
      alert: "Not a match"
    })
    }
  }
},
pairMatch: function(){
  if(this.state.positionMatch && this.state.colorMatch){
    this.setState({
      score: this.state.score+10, 
      miss: false, 
      alert: "Good job"
    })
  }
  else{
    if(this.state.score!==0){
      this.setState({
      score: this.state.score-5,
      alert: "Not a match"
    })
    }
    else{
      this.setState({
      alert: "Not a match"
    })
    }
  }
},
  render: function() {
    return (
      <div className="gameContainer">
        <div className="gameRow">
          <div id="square1" className="gameSquare" style={this.state.style[0]}></div>
          <div id="square2" className="gameSquare" style={this.state.style[1]}></div>
          <div id="square3" className="gameSquare" style={this.state.style[2]}></div>
        </div>
        <div className="gameRow">
          <div id="square4" className="gameSquare" style={this.state.style[3]}></div>
          <div id="square5" className="gameSquare" style={this.state.style[4]}></div>
          <div id="square6" className="gameSquare" style={this.state.style[5]}></div>
        </div>
        <div className="gameRow">
          <div id="square7" className="gameSquare" style={this.state.style[6]}></div>
          <div id="square8" className="gameSquare" style={this.state.style[7]}></div>
          <div id="square9" className="gameSquare" style={this.state.style[8]}></div>
        </div>
        <div><b>Score: {this.state.score}</b>   {this.state.alert}</div>
        <button onClick={this.position}>Start Position</button>
        <button onClick={this.positionAndColor}>Start Position and Color</button>
        <button onClick={this.positionMatch}>Position Match</button>
        <button onClick={this.colorMatch}>Color Match</button>
        <button onClick={this.pairMatch}>Pair Match</button>
      </div>
    );
  }
});

//standard color
var standardStyle={
  backgroundColor: 'yellow', 
}

//changing colors
var newStyle=[{backgroundColor: '#DBFF33'},{backgroundColor: '#B15CCB'},{backgroundColor: '#5CCBAF'},{backgroundColor: '#5CCD93'},
{backgroundColor: '#87CD5C'},{backgroundColor: '#D3A43F'},{backgroundColor: '#D3563F'},{backgroundColor: '#3F49D3'},{backgroundColor: '#C91A83'}]

 ReactDOM.render(<Game />, document.getElementById('root'));

// ReactDOM.render(
//   <Mainmenu/>, document.getElementById('root'));
