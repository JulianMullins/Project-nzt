var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;
//var MenuOverlay = require('./menu/MenuOverlay');
//var LoginOverlay = require('./menu/LoginOverlay');
//var RegisterOverlay = require('./menu/RegisterOverlay');
//var Mainmenu = require('./menu/Mainmenu');


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
      pressed: false,
      mode: this.props.mode
    }
  },
  componentDidMount: function() {
    setInterval(this.timer, 1000);

    fetch('/startGame/'+this.state.mode+'/'+this.state.N, {
    	method: 'post'
    });

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
  positionAndColor: function(){
    console.log(this.state.style,'current style')
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
  tripleMatch: function(){
    var positionQueue = [];
    var colorQueue = [];
    var soundQueue = [];
    var timeTilPositionMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeTilColorMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeTilSoundMatch = parseInt((Math.random() * 5) + 2 + this.state.N);

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

//NOT GOING TO ACTUALLY LIGHT UP COLORS UNTIL ALL IF STATEMENTS HAVE ITERATED
//case 1: position match
  if (timeTilPositionMatch===0) {
  console.log('position match')
  //reset position portion
  timeTilPositionMatch = parseInt((Math.random() * 5) + 2);

  //set up new position queue
  var nextPosition = positionQueue[0];
  positionQueue.push(nextPosition);
  positionQueue.splice(0, 1);
  }

//case 2: color match
  if (timeTilColorMatch===0) {
  console.log('color match')
  //reset position portion
  timeTilColorMatch = parseInt((Math.random() * 5) + 2);

  //set up new position queue
  var nextColor = colorQueue[0];
  colorQueue.push(nextColor);
  colorQueue.splice(0, 1);
  }

 //case 3: sound match
  if (timeTilSoundMatch===0) {
  console.log('sound match')
  //reset position portion
  timeTilSoundMatch = parseInt((Math.random() * 5) + 2);

  //set up new position queue
  var nextSound = soundQueue[0];
  soundQueue.push(nextSound);
  soundQueue.splice(0, 1);
  }

// pick a non-matching next number while interval is not 0
//position:
  var nextPosition = parseInt(Math.random() * 9);
  while (nextPosition == positionQueue[0]) {
    nextPosition = parseInt(Math.random() * 9);
  }

  // resize array to N: color
  positionQueue.push(nextPosition);
  if (positionQueue.length > this.state.N) {
    positionQueue.splice(0, 1);
  }
//color:
  var nextColor = parseInt(Math.random() * 9);
  while (nextColor == colorQueue[0]) {
    nextColor = parseInt(Math.random() * 9);
  }

  // resize array to N: color
  colorQueue.push(nextColor);
  if (colorQueue.length > this.state.N) {
    colorQueue.splice(0, 1);
  }

//sound:
  var nextSound = parseInt(Math.random() * 9);
  while (nextSound == soundQueue[0]) {
    nextSound = parseInt(Math.random() * 9);
  }

  // resize array to N: color
  soundQueue.push(nextSound);
  if (soundQueue.length > this.state.N) {
    soundQueue.splice(0, 1);
  }

  // set color for 800
  this.state.style[nextPosition] = newStyle[nextColor];
  timeTilPositionMatch--;
  timeTilSoundMatch--;
  timeTilColorMatch--;
  //ADAM PLEASE LET ME KNOW HOW TO SET SOUND
  this.setState({style: this.state.style, match: true, miss: true});
  setTimeout(function() {
    this.state.style[nextPosition] = standardStyle;
    this.setState({style: this.state.style});
  }.bind(this), 800);

}.bind(this), 2000);
  // }
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
        <button onClick={this.tripleMatch}>Triple Play</button>
        <button onClick={this.positionAndColor}>Position and Color</button>
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

var newStyle=[{backgroundColor: '#DBFF33'},{backgroundColor: '#B15CCB'},{backgroundColor: '#5CCBAF'},{backgroundColor: '#5CCD93'},
{backgroundColor: '#87CD5C'},{backgroundColor: '#D3A43F'},{backgroundColor: '#D3563F'},{backgroundColor: '#3F49D3'},{backgroundColor: '#C91A83'}]

///ADAM: fill in sound files here please (or wherever else you may have them, but this is how i'm linking them, just as an array of files )
var sound =[1,2,3,4,5,6,7,8,9]

 ReactDOM.render(<Game />, document.getElementById('root'));

// ReactDOM.render(
//   <Mainmenu/>, document.getElementById('root'));
