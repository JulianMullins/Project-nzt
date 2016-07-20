var React = require('react');
var ReactDOM = require('react-dom');

import { Router, Route, hashHistory } from 'react-router'
var url = process.env.url;

var MenuOverlay = require('./menuOverlay');
var Login = require('./loginOverlay');
var Register = require('./registerOverlay');
var Home = require('./Mainmenu');
var GameOver = require('./gameOverOverlay');
var NavBar = require('./navBar');
//Leaderboard
//Stats
//Science
//Contact
//Settings

var RelaxedGame = require('./Modes/relaxedMode');
var ClassicGame = require('./Modes/classicMode');
var SilentGame = require('./Modes/silentMode');
var AdvancedGame = require('./Modes/advancedMode');


var ClassicLevels = require('./levels').ClassicLevels;
var RelaxedLevels = require('./levels').RelaxedLevels;
var SilentLevels =  require('./levels').SilentLevels;
var AdvancedLevels = require('./levels').AdvancedLevels;
import { Link } from 'react-router'
/*
      <Route path="/leaderboard" component={Leaderboard}/>
      <Route path="/stats" component={Stats}/>
      <Route path="/contact" component={Contact}/>
      <Route path="/science" component={Science}/>
      <Route path="/settings" component={Settings}/>
      */

var App = React.createClass({
  render() {
    return (
      <div>
        

        {this.props.children}
      </div>
    )
  }
});


ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}/>
      <Route path="" component={Home} />
      <Route path="login" component={Login}/>
      <Route path="register" component={Register}/>
      <Route path="gameOver" component={GameOver}/>
      
      <Route path="levels/classic" component={ClassicLevels}/>
      <Route path="levels/relaxed" component={RelaxedLevels}/>
      <Route path="levels/silent" component={SilentLevels}/>
      <Route path="levels/advanced" component={AdvancedLevels}/>
      <Route path="game/classic/:n" component={ClassicGame}/>
      <Route path="game/relaxed/:n" component={RelaxedGame}/>
      <Route path="game/silent/:n" component={SilentGame}/>
      <Route path="game/advanced/:n" component={AdvancedGame}/>
  </Router>
  ), document.getElementById('root'),function(){console.log("rendered")});


