var React = require('react');
var ReactDOM = require('react-dom');

var Mainmenu = React.createClass({
  getInitialState: function() {
    return {overlay: true}
  },
  start: function() {
    this.setState({overlay: false});
  },
  render: function() {
    var overlay = this.state.overlay ? (
      <div className="overlay">
        <center>
          <a className="btn" href="#" onClick={this.start}>Start</a>
          <a className="btn" href="#">Login</a>
        </center>
      </div>
    ) : '';
    return (
      <div>
        {overlay}
        <center>
          <h1 id="title">Project NZT</h1>
        </center>
        <div className="menu">
          <a href="#" className="menu-panel">
            <h2>normal</h2>
            <h3>(position, sound)</h3>
          </a>
          <a href="#" className="menu-panel">
            <h2>position-only</h2>
          </a>
        </div>
        <div className="menu">
          <a href="#" className="menu-panel">
            <h2>position & color</h2>
          </a>
          <a href="#" className="menu-panel">
            <h2>advanced</h2>
            <h3>(color, position, sound)</h3>
          </a>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Mainmenu/>, document.getElementById('root'));
