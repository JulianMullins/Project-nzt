var React = require('react');
var ReactDOM = require('react-dom');

var LoginOverlay = React.createClass({
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
            <button className="form-btn dx" onClick={this.props.login}>Login</button>
            <a type="button" className="fb" href="/login/facebook">Login with Facebook</a>
          </div>
        </form>
      </div>
      <div className="register-log">
        <h1>New?</h1>
        <div className="pa">Register here.</div>
        <h3>See your stats, <br></br>track your progress, <br></br>and compare with your friends.</h3>
        <center>
          <form>
            <button className="form-btn dx" onClick={this.props.registerScreen}>Register</button>
          </form>
        </center>
      </div>
    </div>
    )
  }
});

module.exports = LoginOverlay;
