var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;
import {Link} from 'react-router'

var getSquareArr = function(square, mode) {
  var squareClass = "";
  var maxSquares = 0;
  if (square <= 4) {
    maxSquares = 4;
    squareClass = "grid4"
  } else {
    maxSquares = 9;
    squareClass = "grid9"
  }
  var arr = [];
  for (var i = 1; i < maxSquares + 1; i++) {
    var link = "/game/" + mode + "/" + i;
    var sqClass = (i == square)
      ? "levelSquare " + squareClass
      : "levelSquareLast " + squareClass;
    if (i <= square) {
      var colorStyle = {
        backgroundColor: '#F13542',
        opacity: 1 - (0.4 / maxSquares) * i
      };
      if (mode == 'relaxed') {
        colorStyle.backgroundColor = '#01B6A7';
      } else if (mode == 'silent') {
        colorStyle.backgroundColor = '#7CD9D2';
      } else if (mode == 'advanced') {
        colorStyle.backgroundColor = '#F1BA03';
      }
    } else {
      var colorStyle = {
        border: '2px solid #F13542',
        opacity: 1 - (0.4 / maxSquares) * i,
        pointerEvents: 'none',
        cursor: 'default'
      };
      if (mode == 'relaxed') {
        colorStyle.border = '2px solid #01B6A7';
      } else if (mode == 'silent') {
        colorStyle.border = '2px solid #7CD9D2';
      } else if (mode == 'advanced') {
        colorStyle.border = '2px solid #F1BA03';
      }
    }
    arr.push(
      <Link to={link} className={sqClass} key={i} style={colorStyle}></Link>
    );
  }
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
    return {maxN: 7, mode: 'classic'}
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
    return {maxN: 3, mode: 'relaxed'}
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
      <div className="levelBox">
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
    return {maxN: 5, mode: 'silent'}
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
      <div className="levelBox">
        <h1 id="silent">Silent</h1>
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
      <div className="levelBox">
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
