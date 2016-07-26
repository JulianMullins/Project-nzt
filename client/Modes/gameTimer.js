var React = require('react');

var GameTimer = React.createClass({
  getInitialState: function() {
    return {seconds: 120}
  },
  componentDidMount: function() {
    this.setState({
        interval: setInterval(this.timerSecs, 1000)
      });
  },
  componentWillUnmount: function() {
    clearInterval(this.state.interval);
  },
  timerSecs: function() {
    this.setState({
      seconds: this.state.seconds - 1
    });
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
