var React = require('react');
var ReactDOM = require('react-dom');

import {Router, Route, hashHistory, Link} from 'react-router'
var url = process.env.url;

var MenuOverlay = require('./menuOverlay');
var Login = require('./loginOverlay');
var FacebookLogin = require('./facebookLogin');
var Logout = require('./logout');
var Register = require('./registerOverlay');
var Home = require('./Mainmenu');
var GameOver = require('./gameOver');
var NavBar = require('./navBar');
var Leaderboard = require('./leaderboard');
var Contact = require('./contact');
var Science = require('./science');


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
var SilentLevels = require('./levels').SilentLevels;
var AdvancedLevels = require('./levels').AdvancedLevels;
/*
      <Route path="/leaderboard" component={Leaderboard}/>
      <Route path="/stats" component={Stats}/>
      <Route path="/contact" component={Contact}/>
      <Route path="/science" component={Science}/>
      <Route path="/settings" component={Settings}/>
      */

var App = React.createClass({
  componentDidMount() {
    if (this.props.location.pathname === '/') {
      this.props.history.push('/home')
    }
  },
  render() {
    return (
      <div>

        <NavBar/> {this.props.children}
      </div>
    )
  }
});

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="home" component={Home}/>
      <Route path="login/facebook" component={FacebookLogin}/>
      <Route path="login" component={Login}/>
      <Route path="logout" component={Logout}/>
      <Route path="register" component={Register}/>
      <Route path="gameOver" component={GameOver}/>
      <Route path="leaderboard" component={Leaderboard}/>
      <Route path="contact" component={Contact}/>
      <Route path="science" component={Science}/>

      <Route path="levels/classic" component={ClassicLevels}/>
      <Route path="levels/relaxed" component={RelaxedLevels}/>
      <Route path="levels/silent" component={SilentLevels}/>
      <Route path="levels/advanced" component={AdvancedLevels}/>
      <Route path="game/classic/:n" component={ClassicGame}/>
      <Route path="game/relaxed/:n" component={RelaxedGame}/>
      <Route path="game/silent/:n" component={SilentGame}/>
      <Route path="game/advanced/:n" component={AdvancedGame}/>
    </Route>
  </Router>
), document.getElementById('root'), function() {
  console.log("rendered")
});
