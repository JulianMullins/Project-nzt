var React = require('react');
var interval;

var GameTimer = React.createClass({
  getInitialState: function() {
    return {seconds: 120}
  },
  componentDidMount: function() {
    interval = setInterval(this.timerSecs, 1000)
  },
  componentWillUnmount: function() {
    clearInterval(interval);
  },
  timerSecs: function() {
    this.setState({
      seconds: this.state.seconds - 1
    });
    if (this.state.seconds == 0) {
      clearInterval(interval);
    }
  },
  render: function() {
    // console.log("Style: ", this.props.timeStyle);
    return (
      <div className="timerContainer">
        <h2 className="gameTimer" style={this.props.timeStyle}>{Math.floor(this.state.seconds / 60)}:{("0" + this.state.seconds % 60).slice(-2)}</h2>
      </div>
    )
  }
});

module.exports = GameTimer
