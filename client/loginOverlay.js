var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router';

var LoginOverlay = React.createClass({
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
  render: function() {
    return (
      <div className="screen">
      <div className="circle"></div>
      <div className="login" id="login">
        <h1>Welcome</h1>
        <div className="pa">Login here.</div>
        <form>
          <input type="text" placeholder="Name or Email" name="username" id="username"></input>
          <br></br>
          <input type="password" placeholder="Password" name="password" id="password"></input>
          <div className="buttongroup">
            <button className="form-btn dx" onClick={this.login}><Link to="/">Login</Link></button>
            <a type="button" className="fb" href="/login/facebook">Login with Facebook</a>
          </div>
        </form>
      </div>
      <div className="register-log">
        <h1>New?</h1>
        <div className="pa"><Link to="/register">Register here.</Link></div>
        <h3>See your stats, track your progress, <br></br>track your progress, <br></br>and compare with your friends.</h3>
        <center>
          <form>
            <button className="form-btn dx"><Link to="/register">Register</Link></button>
          </form>
        </center>
      </div>
    </div>
    )
  }
});

module.exports = LoginOverlay;
