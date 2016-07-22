var React = require('react');
var ReactDOM = require('react-dom');
import {Link} from 'react-router';

var LoginOverlay = React.createClass({
  getInitialState: function() {
    return {username: '', password: ''}
  },
  update(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  },
  login: function(e) {
    console.log("logging in")
    e.preventDefault();
    console.log(this.props)

    //ajax post
    fetch('/login', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: this.state.username, password: this.state.password})
    }).then(function(response) {
      return response.json();
    }).then(function(response) {
      if (response.success) {
        this.props.history.push('/home');
      } else if (!response.success) {}
    }.bind(this))
  },
  facebook: function(e) {
    e.preventDefault();

    //ajax facebook get

    fetch('/login/facebook', {method: 'get'})

  },
  render: function() {
    return (
      <div className="screen">
        <div className="login" id="login">
          <h1>Hey you!</h1>
          <div className="pa">Login here.</div>
          <form>
            <input type="text" placeholder="Name or Email" name="username" id="username" value={this.state.username} onChange={this.update} autoFocus={focus}></input>
            <br></br>
            <input type="password" placeholder="Password" name="password" id="password" value={this.state.password} onChange={this.update}></input>
            <div className="buttongroup">
              <button className="form-btn dx" onClick={this.login}>Login</button>
              <a type="button" className="fb" href="/login/facebook">Login with Facebook</a>
            </div>
          </form>
        </div>
        <div className="register-log">
          <h1>New?</h1>
          <div className="pa">
            <Link to="/register">Register here.</Link>
          </div>
          <h3>See your stats,
            <br></br>track your progress,
            <br></br>and improve your IQ.</h3>
          <form>
            <div className="buttongroup">
              <button className="form-btn dx">
                <Link to="/register">Register</Link>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
});

module.exports = LoginOverlay;
