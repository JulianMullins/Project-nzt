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
      <div className="overlay" id="login">
        <center>
          <form>
            <input type="text" placeholder="username" name="username" id="username"></input>
            <br></br>
            <input type="password" placeholder="password" name="password" id="password"></input>
            <br></br>
            <button onClick={this.login}><Link to="/">Login</Link></button>
            <br></br>
            <a type="button" className="btn btn-default" href="/login/facebook">Login with Facebook</a>
            <br></br>
            <button><Link to="/register">Register</Link></button>
            </form>
        </center>
      </div>
    )
  }
});

module.exports = LoginOverlay;