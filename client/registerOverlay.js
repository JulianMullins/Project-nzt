var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router';

var RegisterOverlay = React.createClass({
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


  },
  render: function() {
    return (
      <div className="screen">
        <div className="register" id="login">
          <h1>Welcome</h1>
          <div className="pa">Create an account to get started.</div>
          <form>
            <input type="text" placeholder="username" name="username" id="username" autoFocus={focus}></input>
            <br></br>
            <input type="text" placeholder="email" name="email" id="email"></input>
            <br></br>
            <input type="password" placeholder="password" name="password" id="password"></input>
            <br></br>
            <input type="password" placeholder="confirm password" name="passwordConfirm" id="passwordConfirm"></input>
              <div className="buttongroup">
                <button className="form-btn dx" onClick={this.register}><Link to="/">Register</Link></button>
                <button className="form-btn dx2"><Link to="/login">Already have an account? Login here.</Link></button>
              </div>
          </form>
        </div>
      </div>
    )
  }
});

module.exports=RegisterOverlay;
