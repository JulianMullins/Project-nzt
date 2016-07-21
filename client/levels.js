var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;
import {Link} from 'react-router'

var getSquareArr = function(square, mode) {
  var squareClass = "";
  if (square === 1) {
    squareClass = "grid1";
  } else if (square <= 4) {
    squareClass = "grid4"
  } else {
    squareClass = "grid9"
  }
  var arr = [];
  for (var i = 1; i < square; i++) {
    var link = "/game/" + mode + "/" + i;
    var sqClass = "levelSquare " + squareClass
    arr.push(
      <Link to={link} className={sqClass} key={i}></Link>
    );
  }
  var link = "/game/" + mode + "/" + i
  var sqClass = "levelSquareLast " + squareClass
  arr.push(
    <Link to={link} className={sqClass} key={i}></Link>
  );
  return arr;
};

var getMaxN = function(mode, cb) {
  console.log("getting max n")
  fetch('/getMaxN', {
    method: 'get',
    credentials: 'include'
  }).then(function(response) {
    return response.json();
  }).then(function(response) {
    console.log(response.maxN)
    return cb(response.maxN)
  })
};

var ClassicLevels = React.createClass({
  getInitialState: function() {
    return {
      //write function that will get current user's mode's level
      maxN: 1,
      mode: 'classic'
    }
  },
  componentDidMount() {
    this.setMaxN();
  },
  setMaxN: function() {
    getMaxN(this.state.mode, function(maxN) {
      this.setState({maxN: maxN})
      console.log("maxN is " + this.state.maxN)
    }.bind(this))
  },
  render: function() {

    var square = this.state.maxN;
    var squareArr = getSquareArr(square, this.state.mode)

    return (
      <div className="levelBox">
        <h1 id="classic">Classic</h1>
        <div className="grid">
          {squareArr.map(function(square) {
            return square;
          })}
        </div>
        <h3>Highest: Level {this.state.maxN}</h3>
      </div>
    );
  }
});

var RelaxedLevels = React.createClass({
  getInitialState: function() {
    return {maxN: 1, mode: 'relaxed'}
  },
  componentDidMount() {
    this.setMaxN();
  },
  setMaxN: function() {
    getMaxN(this.state.mode, function(maxN) {
      this.setState({maxN: maxN})
    }.bind(this))
  },
  render: function() {
    var square = this.state.maxN;
    var squareArr = getSquareArr(square, this.state.mode)
    return (
      <div>
        <h1 id="relaxed">Relaxed</h1>
        <div className="grid">
          {squareArr.map(function(square) {
            return square;
          })}
        </div>
        <h3>Highest: Level {this.state.maxN}</h3>
      </div>
    );
  }
});

var SilentLevels = React.createClass({
  getInitialState: function() {
    return {maxN: 1, mode: 'silent'}
  },
  setMaxN: function() {
    getMaxN(this.state.mode, function(maxN) {
      this.setState({maxN: maxN})
    }.bind(this))
  },
  componentDidMount() {
    this.setMaxN();
  },
  render: function() {
    var square = this.state.maxN;
    var squareArr = getSquareArr(square, this.state.mode)

    return (
      <div>
        <h1 id="classic">Silent</h1>
        <div className="grid">
          {squareArr.map(function(square) {
            return square;
          })}
        </div>
        <h3>Highest: Level {this.state.maxN}</h3>
      </div>
    );
  }
});

var AdvancedLevels = React.createClass({
  getInitialState: function() {
    return {maxN: 1, mode: 'advanced'}
  },
  setMaxN: function() {
    getMaxN(this.state.mode, function(maxN) {
      this.setState({maxN: maxN})
    }.bind(this))
  },
  componentDidMount() {
    this.setMaxN();
  },
  render: function() {
    var square = this.state.maxN;
    var squareArr = getSquareArr(square, this.state.mode)

    return (
      <div class="levelBox">
        <h1 id="advanced">Advanced</h1>
        <div className="grid">
          {squareArr.map(function(square) {
            return square;
          })}
        </div>
        <h3>Highest: Level {this.state.maxN}</h3>
      </div>
    );
  }
});

module.exports = {
  ClassicLevels: ClassicLevels,
  RelaxedLevels: RelaxedLevels,
  SilentLevels: SilentLevels,
  AdvancedLevels: AdvancedLevels
}
