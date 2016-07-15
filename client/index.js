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

<<<<<<< HEAD
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
=======
ReactDOM.render(
  <Mainmenu/>, document.getElementById('root'));
>>>>>>> refs/remotes/origin/master
