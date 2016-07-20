var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;


var ClassicLevels = React.createClass({
  getInitialState: function(){
    return {
      //write function that will get current user's mode's level
      n: 7
    }
  },
  classic: function(e){
    e.preventDefault();
    // ReactDOM.render(
    //   <Classic level={n}></Classic>, document.getElementById('root'));
  },
  render: function() {
    var square = this.state.n;
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
      arr.push(<a href="" className={"levelSquare " + squareClass} onClick={this.classic}></a>);
    }
    arr.push(<a href="" className={"levelSquareLast " + squareClass} onClick={this.classic}></a>);

    return(
    <div className="levelBox">
      <h1 id="classic">Classic</h1>
        <div className="grid">
          {arr.map(function(square){
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
      // levels: this.props.maxlevel,
    }
  },
  relaxed: function(n){
    ReactDOM.render(
      <Relaxed level={n}></Relaxed>, document.getElementById('root'));
  },
  render: function() {
    return(
    <div>
      <h1 id="relaxed">Relaxed</h1>
      <div className="levelContainer">
        <div className="levelRow">
          <a href="" className="levelSquare"></a>
          <a href="" className="levelSquareLast" onClick={this.relaxed(2)}></a>
        </div>
        <h3>Level 3</h3>
      </div>
    </div>
    );
  }
});

var SilentLevels = React.createClass({
  getInitialState: function(){
    return {
      // levels: this.props.maxlevel,
    }
  },
  silent: function(n){
    ReactDOM.render(
      <Silent level={n}></Silent>, document.getElementById('root'));
  },
  render: function() {
    return(
    <div>
      <h1 id="classic">Silent</h1>
      <div className="levelContainer">
        <div className="levelRow">
          <a href="" className="levelSquare"></a>
          <a href="" className="levelSquareLast" onClick={this.silent(2)}></a>
        </div>
        <h3>Level 3</h3>
      </div>
    </div>
    );
  }
});

var AdvancedLevels = React.createClass({
  getInitialState: function(){
    return {
      // levels: this.props.maxlevel,
    }
  },
  advanced: function(n){
    ReactDOM.render(
      <Advanced level={n}></Advanced>, document.getElementById('root'));
  },
  render: function() {
    return(
    <div class="levelBox">
      <h1 id="advanced">Advanced</h1>
      <div className="levelContainer">
        <div className="levelRow">
          <a href="" className="levelSquare"></a>
          <a href="" className="levelSquareLast" onClick={this.advanced(2)}></a>
        </div>
        <h3>Highest: Level {n}</h3>
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
