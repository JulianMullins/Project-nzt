var React = require('react');
var ReactDOM = require('react-dom');

var Mainmenu = React.createClass({
  render: function() {
    return (
      <div>
        <div className="overlay">
          <a className="btn">Start</a>
          <a className="btn">Login</a>
        </div>
        <center>
          <h1 id="title">Project NZT</h1>
        </center>
      </div>
    );
  }
});

ReactDOM.render(
  <Mainmenu/>, document.getElementById('root'));
