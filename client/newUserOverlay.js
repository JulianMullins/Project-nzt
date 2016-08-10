var React = require('react');
var axios = require('axios');

import {Link} from 'react-router';

var NewUserOverlay = React.createClass({
  stopShowOverlay() {
    axios.post('/stopShowOverlay', {stop: true})
  },
  componentDidMount: function() {
    axios.post('/stopShowOverlay', {
      withCredentials: true,
      data: {
        stop: true
      }
    }).then(function(response) {
      console.log("stop show overlay posted " + response.data.success, response.data.error)
    });
  },
  close: function() {},
  render: function() {
    console.log("showing tutorial")
    return (
      <div className="overlaySmall">
        <span className="fa fa-times fa-3x closeButton" onClick={this.props.click}></span>
        <div className="newUserOverlay">
          <div className="newUserTop">
            <h1>First Time Here?</h1>
            <i>Cortex is a modern take on dual n-back, a scientifically supported game designed to exercise working memory and increase fluid-intelligence (IQ).
            </i>
          </div>
          <div className="newUserBottom">
            <div className="newUserLeft">
              <p>Before you start playing, how about visiting the tutorial page to get started?</p>
              <Link to="/tutorial">Tutorial</Link>
            </div>
            <div className="newUserRight">
              <p>If you want to just jump right in, we recommend playing in relaxed mode first.</p>
              <Link to="levels/relaxed">Relaxed Mode</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = NewUserOverlay
