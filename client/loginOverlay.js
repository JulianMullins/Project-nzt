var React = require('react');
var ReactDOM = require('react-dom');

var LoginOverlay = React.createClass({
  render: function() {
    return (
      <div className="overlay" id="login">
        <center>
          <form>
            <input type="text" placeholder="username" name="username" id="username"></input>
            <br></br>
            <input type="password" placeholder="password" name="password" id="password"></input>
            <br></br>
            <button onClick={this.props.login}>Login</button>
            <br></br>
            <a type="button" href="/login/facebook">Login with Facebook</a>
            <br></br>
            <button onClick={this.props.registerScreen}>Register</button>
            <br></br>
            <button onClick={this.props.back} className="back">Back</button>
          </form>
        </center>
      </div>
    )
  }
});

module.exports = LoginOverlay;