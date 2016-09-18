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
  } else if (square <= 9) {
    maxSquares = 9;
    squareClass = "grid9"
  } else if (square <= 16) {
    maxSquares = 16;
    squareClass = "grid16"
  } else {
    maxSquares = 25;
    squareClass = "grid25"
  }
  var arr = [];
  for (var i = 1; i < maxSquares + 1; i++) {
    var link = "/game/" + mode + "/" + i;
    var sqClass = "levelSquare " + squareClass;
    if (i <= square) {
      var colorStyle = {
        backgroundColor: '#F13542',
        color: "white",
        opacity: 1 - (0.4 / maxSquares) * i
      };
      var opacityStyle = {
        backgroundColor: '#F13542',
        opacity: .8 - (0.2 / square) * i
      };
      if (mode === 'relaxed') {
        colorStyle.backgroundColor = '#7CD9D2';
        opacityStyle.backgroundColor = '#7CD9D2';
        opacityStyle.color = "#7CD9D2";
      } else if (mode === 'silent') {
        colorStyle.backgroundColor = '#01B6A7';
        opacityStyle.backgroundColor = '#01B6A7';
      } else if (mode === 'advanced') {
        colorStyle.backgroundColor = '#F1BA03';
        opacityStyle.backgroundColor = '#F1BA03';
      }
    } else {
      var colorStyle = {
        border: '2px solid #F13542',
        opacity: 1 - (0.4 / maxSquares) * i,
        pointerEvents: 'none',
        backgroundColor: "rgba(241, 53, 66, 0.05)",
        color: "#F13542",
        cursor: 'default'
      };
      if (mode == 'relaxed') {
        colorStyle.border = '2px solid #7CD9D2';
        colorStyle.backgroundColor = "rgba(124, 217, 210, 0.05)";
        colorStyle.color = "#7CD9D2"
      } else if (mode == 'silent') {
        colorStyle.border = '2px solid #01B6A7';
        colorStyle.backgroundColor = "rgba(1, 182, 167, 0.05)";
        colorStyle.color = "#01B6A7"
      } else if (mode == 'advanced') {
        colorStyle.border = '2px solid #F1BA03';
        colorStyle.backgroundColor = "rgba(241, 186, 3, 0.05)";
        colorStyle.color = "#F1BA03"
      }
    }
    arr.push(
      <Link to={link} onMouseDown={function(e) {
        e.target.click()
      }} className={sqClass} key={i} style={colorStyle}>
        <div className="front face">{i}</div>
        <div className="side face" style={opacityStyle}></div>
        <div className="back face"></div>
      </Link>
    );
  }
  return arr;
};

var capFirstLetter = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var getMaxN = function(mode, cb) {
  //console.log("getting max n")
  axios.get('/api/getMaxN', {withCredentials: true}).then(function(response) {
    //console.log(response.data.maxN)
    return cb(response.data.maxN)
  })
};

var LevelOverlay = React.createClass({
  getInitialState: function() {
    return {
      maxN: 1, 
      mode: this.props.params.mode,
      error: this.props.params.error
    }
  },
  setMaxN: function() {
    getMaxN(this.state.mode, function(maxN) {
      this.setState({
        maxN: maxN[this.state.mode]
      })
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
        <h1 id={this.state.mode} className={this.state.mode}>{capFirstLetter(this.state.mode)}</h1>
        {this.state.error
          ? <div className='classic'>Unauthorized!</div>
          : ''}
        <div className="grid">
          {squareArr.map(function(square) {
            return square;
          })}
        </div>
        <div className="levelsFooter">
          <h3 className={this.state.mode}>Highest N-Level: {this.state.maxN}</h3>
          <Link to="/home">
            <h3 className={this.state.mode + "Button returnBtn"}>&larr; Go Back</h3>
          </Link>
        </div>
      </div>
    );
  }
})

module.exports = {
  LevelOverlay: LevelOverlay
}
