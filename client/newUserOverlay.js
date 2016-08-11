var React = require('react');
var axios = require('axios');

import {Link} from 'react-router';

var NewUserOverlay = React.createClass({
  stopShowOverlay() {
    axios.post('/stopShowOverlay')
      .then(function(response){
        if(response.data.success){
          this.props.click();
        }
      }.bind(this))
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
          <div>
            <a onClick={this.stopShowOverlay}>Click here to never show again</a>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = NewUserOverlay
