var React = require('react');
var ReactDOM = require('react-dom');

var MenuOverlay = React.createClass({
  render: function() {
    return (
      <div className="overlay">
        <center>
          <a className="btn" href="" onClick={this.props.start}>Start</a>
          <a className="btn" href="" onClick={this.props.loginScreen}>Login</a>
        </center>
      </div>
    )
  }
})

var LoginOverlay = React.createClass({
  render: function() {
    return (
      <div className="overlay" id="login">
        <center>
          <form>
            <input type="text" placeholder="username"></input>
            <br></br>
            <input type="password" placeholder="password"></input>
            <br></br>
            <button onClick={this.props.login}>Login</button>
            <br></br>
            <button onClick={this.props.back} id="back">Back</button>
          </form>
        </center>
      </div>
    )
  }
});

var Mainmenu = React.createClass({
  getInitialState: function() {
    return {
      menu: true,
      login: false,
      mode: {
        position: true,
        sound: true,
        color: false
      }
    }
  },
  start: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false});
  },
  loginScreen: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: true})
  },
  login: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false});
  },
  back: function(e) {
    e.preventDefault();
    this.setState({menu: true, login: false})
  },
  normalMode: function(e) {
    e.preventDefault();
    this.setState({
      mode: {
        position: true,
        sound: true,
        color: false
      }
    }, this.goToGame);
  },
  posOnly: function(e) {
    e.preventDefault();
    this.setState({
      mode: {
        position: true,
        sound: false,
        color: false
      }
    }, this.goToGame);
  },
  posAndColor: function(e) {
    e.preventDefault();
    this.setState({
      mode: {
        position: true,
        sound: false,
        color: true
      }
    }, this.goToGame);
  },
  advanced: function(e) {
    e.preventDefault();
    this.setState({
      mode: {
        position: true,
        sound: true,
        color: true
      }
    }, this.goToGame);
  },
  goToGame: function() {
    ReactDOM.render(
      <Game mode={this.state.mode}></Game>, document.getElementById('root'));
    console.log(this.state.mode);
  },
  render: function() {
    var menu = this.state.menu
      ? <MenuOverlay start={this.start} loginScreen={this.loginScreen}></MenuOverlay>
      : '';
    var login = this.state.login
      ? <LoginOverlay login={this.login} back={this.back}></LoginOverlay>
      : '';
    return (
      <div>
        {menu}
        {login}
        <center>
          <h1 id="title">Project NZT</h1>
        </center>
        <div className="menu">
          <a href="" className="menu-panel" onClick={this.normalMode}>
            <h2>normal</h2>
            <h3>(position, sound)</h3>
          </a>
          <a href="" className="menu-panel" onClick={this.posOnly}>
            <h2>position-only</h2>
          </a>
        </div>
        <div className="menu">
          <a href="" className="menu-panel" onClick={this.posAndColor}>
            <h2>position & color</h2>
          </a>
          <a href="" className="menu-panel" onClick={this.advanced}>
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
