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
	getInitialState: function() {
		return {

		}
	},

	render: function() {
		return (
			<div className="gameContainer">
				<div className="gameRow">
					<div onClick={this.click} className="gameSquare"></div>
					<div className="gameSquare"></div>
					<div className="gameSquare"></div>
				</div>
				<div className="gameRow">
					<div className="gameSquare"></div>
					<div className="gameSquare"></div>
					<div className="gameSquare"></div>
				</div>
				<div className="gameRow">
					<div className="gameSquare"></div>
					<div className="gameSquare"></div>
					<div className="gameSquare"></div>
				</div>
				<div className="gameButtonsContainer">
					<a>SOUND</a>
					<a>BOTH</a>
					<a>POSITION</a>
				</div>
			</div>
		);
	}
});

ReactDOM.render(<Game />, document.getElementById('root'));
