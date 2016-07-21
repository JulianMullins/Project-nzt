var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;
import { Link } from 'react-router'

var MenuOverlay = require('./menuOverlay');
var LoginOverlay = require('./loginOverlay');
var RegisterOverlay = require('./registerOverlay');


var Mainmenu = React.createClass({

  //initial functions
  getInitialState: function() {
    return{}
  },
  // componentDidMount: function() {
  //   fetch('/isLoggedIn', {
  //     method: 'get',
  //     credentials: 'include'
  //   }).then(function(response) {
  //     return response.json();
  //   }).then(function(response) {
  //     if (response.loggedIn) {
  //       this.start({preventDefault: function() {}});
  //     }
  //   }.bind(this))
  // },

  //functions related to login/registration/main menu
  // start: function(e) {
  //   e.preventDefault();
  //   this.setState({menu: false, login: false, register: false});
  // },
  // loginScreen: function(e) {
  //   e.preventDefault();
  //   this.setState({menu: false, login: true, register: false})
  // },

  // registerScreen: function(e) {
  //   e.preventDefault();
  //   this.setState({menu: false, login: false, register: true})
  // },

  // back: function(e) {
  //   e.preventDefault();
  //   this.setState({menu: true, login: false, register: false})
  // },

  //set mode


  render: function() {
    // var menu = this.state.menu
    //   ? <MenuOverlay start={this.start} loginScreen={this.loginScreen} registerScreen={this.registerScreen}></MenuOverlay>
    //   : '';
    // var login = this.state.login
    //   ? <LoginOverlay login={this.login} back={this.back} registerScreen={this.registerScreen} facebook={this.facebook}></LoginOverlay>
    //   : '';
    // var register = this.state.register
    //   ? <RegisterOverlay register={this.register} back={this.loginScreen}></RegisterOverlay>
    //   : '';
       // {menu}
       // {login}
       // {register}
    return (
      <div>
        <div className="heading">
          <img src="../images/CortexLogo4.svg" />
        </div>
        <div className="menu">
          <a className="menu-panel" id="menu1" onClick={this.classic}>
            <h2>Classic</h2>
            <h3>(position, sound)</h3>
          </a>
          <a className="menu-panel" id="menu2" onClick={this.relaxed}>
            <h2>Relaxed</h2>
            <h3>(position only)</h3>
          </a>
          <a className="menu-panel" id="menu3" onClick={this.silent}>
            <h2>Silent</h2>
            <h3>(position, color)</h3>
          </a>
          <a className="menu-panel" id="menu4" onClick={this.advanced}>
            <h2>Advanced</h2>
            <h3>(color, position, sound)</h3>
          </a>
        </div>
      </div>
    );
  }
});


module.exports = Mainmenu;
