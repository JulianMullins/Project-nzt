var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;
import { Link } from 'react-router'


var getSquareArr = function(square,mode){
  var squareClass = "";
    if(square === 1){
      squareClass="grid1";
    }
    else if(square<=4){
      squareClass="grid4"
    }
    else{
      squareClass="grid9"
    }
    var arr = [];
    for(var i=0; i<square-1; i++){
      arr.push(<Link className="levelSquare {squareClass}" id={i} to="/game/{mode}/{i}"></Link>);
    }
    arr.push(<Link className="levelSquareLast {squareClass}" id={i}  to="/game/{mode}/{i}"></Link>);
    return arr;
};

var getMaxN = function(mode,cb){

  fetch('/getMaxN', {
      method: 'get',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(response) {
      return cb(response.maxN)
    })
};

var ClassicLevels = React.createClass({
  getInitialState: function(){   
    return {
      //write function that will get current user's mode's level
      maxN: 0,
      mode:'classic'
    }
  },
  setMaxN:function(){
    getMaxN(this.state.mode,function(maxN){
      this.setState({maxN:maxN})
    }.bind(this))
  },
  render: function() {
    this.setMaxN();
    var square = this.state.n;
    var squareArr = getSquareClass(square,this.state.mode)
    
    return(
    <div className="levelBox">
      <h1 id="classic">Classic</h1>
        <div className="grid">
          {squareArr.map(function(square){
            return square;
          })}
        </div>
        <h3>Highest: Level {square}</h3>
    </div>
    );
  }
});

var RelaxedLevels = React.createClass({
  getInitialState: function(){
    return {
      maxN:0,
      mode:'relaxed'
    }
  },
  setMaxN:function(){
    getMaxN(this.state.mode,function(maxN){
      this.setState({maxN:maxN})
    }.bind(this))
  },
  render: function() {
    this.setMaxN();
    var square = this.state.n;
    var squareArr = getSquareClass(square,this.state.mode)

    return(
    <div>
      <h1 id="relaxed">Relaxed</h1>
      <div className="grid">
          {squareArr.map(function(square){
            return square;
          })}
        </div>
        <h3>Highest: Level {square}</h3>
    </div>
    );
  }
});

var SilentLevels = React.createClass({
  getInitialState: function(){
    return {
      maxN:0,
      mode:'silent'
    }
  },
  setMaxN:function(){
    getMaxN(this.state.mode,function(maxN){
      this.setState({maxN:maxN})
    }.bind(this))
  },
  render: function() {
    this.setMaxN();
    var square = this.state.n;
    var squareArr = getSquareClass(square,this.state.mode)

    return(
      <div>
        <h1 id="classic">Silent</h1>
        <div className="grid">
            {squareArr.map(function(square){
              return square;
            })}
        </div>
         <h3>Highest: Level {square}</h3>
      </div>
    );
  }
});

var AdvancedLevels = React.createClass({
  getInitialState: function(){
    return {
      maxN:0,
      mode: 'advanced'
    }
  },
  setMaxN:function(){
    getMaxN(this.state.mode,function(maxN){
      this.setState({maxN:maxN})
    }.bind(this))
  },
  render: function() {
    this.setMaxN();
    var square = this.state.n;
    var squareArr = getSquareClass(square,this.state.mode)

    return(
      <div class="levelBox">
        <h1 id="advanced">Advanced</h1>
        <div className="grid">
            {squareArr.map(function(square){
              return square;
            })}
        </div>
        <h3>Highest: Level {square}</h3>
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
