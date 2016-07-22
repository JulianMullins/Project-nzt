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

    fetch('/login/facebook',{method:'get'
    }).then(function(response) {
        return response.json();
      }).then(function(response) {
        if (response.success) {
          this.props.history.push('/home');
        }
      }.bind(this))

  },
  render: function() {
    return (
      <div className="screen">
        <div className="circle"></div>
        <div className="login" id="login">
          <h1>Welcome</h1>
          <div className="pa">Login here.</div>
          <form>
            <input type="text" placeholder="Name or Email" name="username" id="username" value={this.state.username} onChange={this.update} autoFocus={focus}></input>
            <br></br>
            <input type="password" placeholder="Password" name="password" id="password" value={this.state.password} onChange={this.update}></input>
            <div className="buttongroup">
              <button className="form-btn dx" onClick={this.login}>Login</button>
              <button className="form-btn fb" onClick={this.facebook}>Login with Facebook</button>
            </div>
          </form>
        </div>
        <div className="register-log">
          <h1>New?</h1>
          <div className="pa">
            <Link to="/register">Register here.</Link>
          </div>
          <h3>See your stats, track your progress,
            <br></br>track your progress,
            <br></br>and compare with your friends.</h3>
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
