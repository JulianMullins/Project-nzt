var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  render: function() {
    return (
      <h2>Hello React!</h2>
    );
  }
});

var Game = React.createClass({
	render: function() {
		return (
			<div className="container">
				<div className="gameSquare"></div>
				<div className="gameSquare"></div>
				<div className="gameSquare"></div>
				<div className="gameSquare"></div>
				<div className="gameSquare"></div>
				<div className="gameSquare"></div>
				<div className="gameSquare"></div>
				<div className="gameSquare"></div>
				<div className="gameSquare"></div>
			</div>
		);
	}
});

ReactDOM.render(<Game />, document.getElementById('root'));
