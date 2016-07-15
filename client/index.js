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

var GameTimer = React.createClass({
	getInitialState: function() {
		return {
			seconds: 120
		}
	},

	componentDidMount: function() {
		setTimeout(function() {this.setState({interval: setInterval(this.timerSecs, 1000)})}.bind(this), 3000);
	},
	timerSecs: function() {
		this.setState({
			seconds: this.state.seconds-1
		})
		if(this.state.seconds === 0) {
			clearInterval(this.state.interval);
		}
	},
	render: function() {
		return (
			<div className="timerContainer">
				<h1 className="gameTimer">{Math.floor(this.state.seconds/60)}:{("0" + this.state.seconds % 60).slice(-2)}</h1>
			</div>
		)
	}
});

var Game = React.createClass({
	getInitialState: function() {
		return {
			overlay: true,
			initialTimer: 3, //seconds
		}
	},
	componentDidMount: function() {
		setInterval(this.timer, 1000);
	},
	timer: function() {
		this.setState({
			initialTimer: this.state.initialTimer-1
		})
		if(this.state.initialTimer <=0) {
			this.setState({
				overlay: false
			})
		}
	},
	render: function() {
	var overlay = this.state.overlay ? (
      <div className="overlay">
        <center>
          <a className="btn" href="#">{this.state.initialTimer}</a>
        </center>
      </div>
    ) : '';

		return (
			<div className="gameContainer">
			{overlay}
			<GameTimer></GameTimer>
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

ReactDOM.render(<Game/>, document.getElementById('root'));

// ReactDOM.render(
//   <Mainmenu/>, document.getElementById('root'));
