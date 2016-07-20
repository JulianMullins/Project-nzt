var React = require('react');
var ReactDOM = require('react-dom');

var MenuOverlay = React.createClass({
  render: function() {
    return (
      <div className="overlay">
        <center>
          <a className="btn" href="" onClick={this.props.start}>Start</a>
          <a className="btn" href="" onClick={this.props.loginScreen}>Login</a>
        </center>
      </div>
    )
  }
})

module.exports =   MenuOverlay