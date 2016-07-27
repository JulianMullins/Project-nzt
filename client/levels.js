var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;
var axios = require('axios');
import {Link} from 'react-router'


var getSquareArr = function(square, mode) {
  var squareClass = "";
  var maxSquares = 0;
  if (square <= 4) {
    maxSquares = 4;
    squareClass = "grid4"
  } else if (square <=9) {
    maxSquares = 9;
    squareClass = "grid9"
  } else if (square <=16){
    maxSquares = 16;
    squareClass = "grid16"
  } else {
    maxSquares = 25;
    squareClass = "grid25"
  }
  var arr = [];
  for (var i = 1; i < maxSquares + 1; i++) {
    var link = "/game/" + mode + "/" + i;
    console.log(link)
    var sqClass = "levelSquare " + squareClass;
    if (i <= square) {
      var colorStyle = {
        backgroundColor: '#F13542',
        color: "white",
        opacity: 1 - (0.4 / maxSquares) * i
      };
      var opacityStyle = {backgroundColor: '#F13542', opacity: .8 - (0.2 / square)*i};
      if (mode === 'relaxed') {
        colorStyle.backgroundColor = '#01B6A7';
        opacityStyle.backgroundColor = '#01B6A7';
      } else if (mode === 'silent') {
        colorStyle.backgroundColor = '#7CD9D2';
        opacityStyle.backgroundColor = '#7CD9D2';
      } else if (mode === 'advanced') {
        colorStyle.backgroundColor = '#F1BA03';
        opacityStyle.backgroundColor = '#F1BA03';
      }
    } else {
      var colorStyle = {
        border: '2px solid #F13542',
        opacity: 1 - (0.4 / maxSquares) * i,
        pointerEvents: 'none',
        color: "rgba(0,0,0,0)",
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
      <Link to={link} className={sqClass} key={i} style={colorStyle}>
        <div className="front face">{i}</div>
        <div className="side face" style={opacityStyle}></div>
        <div className="back face"></div>
      </Link>
    );
  }
  return arr;
};

var getMaxN = function(mode, cb) {
  console.log("getting max n")
  axios.get('/getMaxN', {
    withCredentials: true
  }).then(function(response) {
    console.log(response.data.maxN)
    return cb(response.data.maxN)
  })
};

var ClassicLevels = React.createClass({
  getInitialState: function() {
    return {
      maxN: 1,
      mode: 'classic'}
  },
  componentDidMount() {
    this.setMaxN();
  },
  setMaxN: function() {
    getMaxN(this.state.mode, function(maxN) {
      this.setState({maxN: maxN[this.state.mode]})
    }.bind(this))
          console.log("maxN is " + this.state.maxN)

  },
  render: function() {

    var square = this.state.maxN;
    var squareArr = getSquareArr(square, this.state.mode)

    return (
      <div className="levelBox">
        <h1 id="classic" className="classic">Classic</h1>
        <div className="grid">
          {squareArr.map(function(square) {
            return square;
          })}
        </div>
        <div className="levelsFooter">
          <h3 className="classic">Highest: Level {this.state.maxN}</h3>
          <Link to="/home"><h3 className="classicBackground returnBtn">&larr; Go Back</h3></Link>
        </div>
      </div>
    );
  }
});

var RelaxedLevels = React.createClass({
  getInitialState: function() {
    return {
      maxN: 1,
      mode: 'relaxed'}
  },
  componentDidMount() {
    this.setMaxN();
  },
  setMaxN: function() {
    getMaxN(this.state.mode, function(maxN) {
      this.setState({maxN: maxN[this.state.mode]})
    }.bind(this))
  },
  render: function() {
    var square = this.state.maxN;
    var squareArr = getSquareArr(square, this.state.mode)
    return (
      <div className="levelBox">
        <h1 id="relaxed" className="relaxed">Relaxed</h1>
        <div className="grid">
          {squareArr.map(function(square) {
            return square;
          })}
        </div>
        <div className="levelsFooter">
          <h3 className="relaxed">Highest: Level {this.state.maxN}</h3>
          <Link to="/home"><h3 className="relaxedBackground returnBtn">&larr; Go Back</h3></Link>
        </div>
      </div>
    );
  }
});

var SilentLevels = React.createClass({
  getInitialState: function() {
    return {maxN: 1,
      mode: 'silent'}
  },
  setMaxN: function() {
    getMaxN(this.state.mode, function(maxN) {
      this.setState({maxN: maxN[this.state.mode]})
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
        <h1 id="silent" className="silent">Silent</h1>
        <div className="grid">
          {squareArr.map(function(square) {
            return square;
          })}
        </div>
        <div className="levelsFooter">
          <h3 className="silent">Highest: Level {this.state.maxN}</h3>
          <Link to="/home"><h3 className="silentBackground returnBtn">&larr; Go Back</h3></Link>
        </div>
      </div>
    );
  }
});

var AdvancedLevels = React.createClass({
  getInitialState: function() {
    return {maxN: 1,
     mode: 'advanced'}
  },
  setMaxN: function() {
    getMaxN(this.state.mode, function(maxN) {
      this.setState({maxN: maxN[this.state.mode]})
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
        <h1 id="advanced" className="advanced">Advanced</h1>
        <div className="grid">
          {squareArr.map(function(square) {
            return square;
          })}
        </div>
        <div className="levelsFooter">
          <h3 className="advanced">Highest: Level {this.state.maxN}</h3>
          <Link to="/home"><h3 className="advancedBackground returnBtn">&larr; Go Back</h3></Link>
        </div>
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
