var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;
var Levels = require('./levels');
var ClassicLevels = Levels.ClassicLevels;
var RelaxedLevels = Levels.RelaxedLevels;


var MenuOverlay = require('./menuOverlay');
var LoginOverlay = require('./loginOverlay');
var RegisterOverlay = require('./registerOverlay');


var Mainmenu = React.createClass({

  //initial functions
  getInitialState: function() {
    return {
      menu: true,
      login: false,
      register: false,
    }
  },
  componentDidMount: function() {
    fetch('/isLoggedIn', {
      method: 'get',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(response) {
      if (response.loggedIn) {
        this.start({preventDefault: function() {}});
      }
    }.bind(this))
  },

  //functions related to login/registration/main menu
  start: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: false});
  },
  loginScreen: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: true, register: false})
  },
  login: function(e) {
    console.log("logging in")
    e.preventDefault();

    //ajax post
    fetch('/login', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: document.getElementById('username').value, password: document.getElementById('password').value})
    }).then(function(response) {
      return response.json();
    }).then(function(response) {
      if (response.success) {
        this.setState({menu: false, login: false, register: false})
      } else if (!response.success) {}
    }.bind(this))
  },

  facebook: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: false});

    //ajax facebook get

    fetch('/login/facebook', {method: 'get'})

  },
  registerScreen: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: true})
  },
  register: function(e) {
    e.preventDefault();

    //ajax post
    fetch('/register', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        passwordConfirm: document.getElementById('passwordConfirm').value})
    });

    this.setState({menu: false, login: true, register: false});

  },
  back: function(e) {
    e.preventDefault();
    this.setState({menu: true, login: false, register: false})
  },

  //set mode
  classic: function(e) {
    e.preventDefault();
    ReactDOM.render(
      <ClassicLevels></ClassicLevels>, document.getElementById('root'));
  },
  relaxed: function(e) {
    e.preventDefault();
    ReactDOM.render(
      <RelaxedLevels></RelaxedLevels>, document.getElementById('root'));
  },
  silent: function(e) {
    e.preventDefault();
    ReactDOM.render(
      <SilentLevels></SilentLevels>, document.getElementById('root'));
  },
  advanced: function(e) {
    e.preventDefault();
    ReactDOM.render(
      <AdvancedLevels></AdvancedLevels>, document.getElementById('root'));
  },

  //start game
  goToGame: function() {
    ReactDOM.render(
      <Game mode={this.state.mode}></Game>, document.getElementById('root'));
  },

  render: function() {
    var menu = this.state.menu
      ? <MenuOverlay start={this.start} loginScreen={this.loginScreen} registerScreen={this.registerScreen}></MenuOverlay>
      : '';
    var login = this.state.login
      ? <LoginOverlay login={this.login} back={this.back} registerScreen={this.registerScreen} facebook={this.facebook}></LoginOverlay>
      : '';
    var register = this.state.register
      ? <RegisterOverlay register={this.register} back={this.loginScreen}></RegisterOverlay>
      : '';
    return (
      <div>
       {menu}
       {login}
       {register}
        <div className="heading">
          <img src="../images/CortexLogo4.svg" />
        </div>
        <div className="menu">
          <a href="" className="menu-panel" id="menu1" onClick={this.classic}>
            <h2>Classic</h2>
            <h3>(position, sound)</h3>
          </a>
          <a href="" className="menu-panel" id="menu2" onClick={this.relaxed}>
            <h2>Relaxed</h2>
            <h3>(position only)</h3>
          </a>
          <a href="" className="menu-panel" id="menu3" onClick={this.silent}>
            <h2>Silent</h2>
            <h3>(position, color)</h3>
          </a>
          <a href="" className="menu-panel" id="menu4" onClick={this.advanced}>
            <h2>Advanced</h2>
            <h3>(color, position, sound)</h3>
          </a>
        </div>
      </div>
    );
  }
});


module.exports = Mainmenu;
