var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;
var axios = require('axios')

var Levels = require('./levels');
var ClassicLevels = Levels.ClassicLevels;
var RelaxedLevels = Levels.RelaxedLevels;

import {Link} from 'react-router'

var LoginOverlay = require('./loginOverlay');
var RegisterOverlay = require('./registerOverlay');

var Mainmenu = React.createClass({

  //initial functions
  getInitialState: function() {
    return {
      name:null,
      hasUsername:false,
      userWelcome:<div></div>
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.location.pathname === "/home") {
      axios.get('/getUser')
        .then(function(response){
          this.setState({
            hasUsername:response.data.isUser,
            name:response.data.name,
          })
        }.bind(this)).then(function() {
          if(this.state.hasUsername){
            this.setState({
              userWelcome: <h3 className="advanced userWelcome">Welcome {this.state.name}!</h3>
            })
        }
      }.bind(this))
    }
  },
  componentDidMount: function(){
    axios.get('/getUser')
      .then(function(response){
        this.setState({
          hasUsername:response.data.isUser,
          name:response.data.name,
        })
      }.bind(this)).then(function() {
        if(this.state.hasUsername){
          this.setState({
            userWelcome: <h3 className="advanced userWelcome">Welcome: {this.state.name}</h3>
          })
      }
    }.bind(this))
  },
  classic() {
    this.props.history.push('/levels/classic')
  },
  relaxed() {
    this.props.history.push('/levels/relaxed')
  },
  silent() {
    this.props.history.push('/levels/silent')
  },
  advanced() {
    this.props.history.push('/levels/advanced')
  },
  render: function() {
    // var username = this.state.hasUsername
    //   ?   (<h3 className="advanced userWelcome">Welcome: {this.state.name}</h3>)
    //   : '';
    return (
      <div>
        <div className="heading">
          <img src="../images/CortexLogo4.svg"/>
          <div className="userHeading">
            {this.state.userWelcome}
          </div>
        </div>
        <div className="menu">
          <a className="menu-panel classicBackground" onClick={this.classic}>
            <h2>Classic</h2>
            <h3>position, sound</h3>
          </a>
          <a className="menu-panel relaxedBackground" onClick={this.relaxed}>
            <h2>Relaxed</h2>
            <h3>position only</h3>
          </a>
          <a className="menu-panel silentBackground" onClick={this.silent}>
            <h2>Silent</h2>
            <h3>position, color</h3>
          </a>
          <a className="menu-panel advancedBackground" onClick={this.advanced}>
            <h2>Advanced</h2>
            <h3>color, position, sound</h3>
          </a>
        </div>
      </div>
    );
  }
});

module.exports = Mainmenu;
