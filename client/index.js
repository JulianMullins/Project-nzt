var React = require('react');
var ReactDOM = require('react-dom');

var Mainmenu = React.createClass({
  getInitialState: function() {
    return {overlay: true}
  },
  start: function() {
    this.setState({overlay: false});
  },
  render: function() {
    var overlay = this.state.overlay ? (
      <div className="overlay">
        <center>
          <a className="btn" href="#" onClick={this.start}>Start</a>
          <a className="btn" href="#">Login</a>
        </center>
      </div>
    ) : '';
    return (
      <div>
        {overlay}
        <center>
          <h1 id="title">Project NZT</h1>
        </center>
        <div className="menu">
          <a href="#" className="menu-panel">
            <h2>normal</h2>
            <h3>(position, sound)</h3>
          </a>
          <a href="#" className="menu-panel">
            <h2>position-only</h2>
          </a>
        </div>
        <div className="menu">
          <a href="#" className="menu-panel">
            <h2>position & color</h2>
          </a>
          <a href="#" className="menu-panel">
            <h2>advanced</h2>
            <h3>(color, position, sound)</h3>
          </a>
        </div>
      </div>
    );
  }
});

var Game = React.createClass({
	render: function() {
		return (
			<div className="gameContainer">
				<div className="gameRow">
					<div id="square1" className="gameSquare"></div>
					<div id="square2" className="gameSquare"></div>
					<div id="square3" className="gameSquare"></div>
				</div>
				<div className="gameRow">
					<div id="square4" className="gameSquare"></div>
					<div id="square5" className="gameSquare"></div>
					<div id="square6" className="gameSquare"></div>
				</div>
				<div className="gameRow">
					<div id="square7" className="gameSquare"></div>
					<div id="square8" className="gameSquare"></div>
					<div id="square9" className="gameSquare"></div>
				</div>
				<div className="gameButtonsContainer">
					<a>Sound</a>
					<a>Both</a>
					<a>Position</a>
				</div>
			</div>
		);
	}
});

//ReactDOM.render(<Game />, document.getElementById('root'));

ReactDOM.render(
  <Mainmenu/>, document.getElementById('root'));
