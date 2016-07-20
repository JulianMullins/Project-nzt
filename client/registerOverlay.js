var React = require('react');
var ReactDOM = require('react-dom');

var RegisterOverlay = React.createClass({
  render: function() {
    return (
      <div className="overlay" id="login">
        <center>
          <form>
            <input type="text" placeholder="username" name="username" id="username"></input>
            <br></br>
            <input type="text" placeholder="email" name="email" id="email"></input>
            <br/>
            <input type="password" placeholder="password" name="password" id="password"></input>
            <br></br>
            <input type="password" placeholder="confirm password" name="passwordConfirm" id="passwordConfirm"></input>
            <br></br>
            <button onClick={this.props.register}>Register</button>
            <br></br>
            <button onClick={this.props.back} className="back">Already have an account?</button>
          </form>
        </center>
      </div>
    )
  }
});

module.exports=RegisterOverlay;