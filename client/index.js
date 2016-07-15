var React = require('react');
var ReactDOM = require('react-dom');

var Mainmenu = React.createClass({
  render: function() {
    return (
      <div>
        <div className="overlay">
          <a className="btn">Start</a>
          <a className="btn">Login</a>
        </div>
        <center>
          <h1 id="title">Project NZT</h1>
        </center>
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

ReactDOM.render(<Game />, document.getElementById('root'));
