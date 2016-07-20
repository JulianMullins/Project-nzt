var React = require('react');
var ReactDOM = require('react-dom');
var react-router = require('react-router');
import { Router, Route, hashHistory } from 'react-router'
var url = process.env.url;

var MenuOverlay = require('./menuOverlay');
var LoginOverlay = require('./loginOverlay');
var RegisterOverlay = require('./registerOverlay');
var Mainmenu = require('./Mainmenu');
var GameOverOverlay = require('./gameOverOverlay');
var Levels = require('./levels').Levels;
var NavBar = require('./navBar');

var RelaxedMode = require('./Modes/relaxedMode');
var ClassicMode = require('./Modes/classicMode');
var SilentMode = require('./Modes/silentMode');
var AdvancedMode = require('./Modes/advancedMode');


ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={NavBar}>
      <Route path="/repos" component={Repos}/>
      {/* add the new route */}
      <Route path="/repos/:userName/:repoName" component={Repo}/>
      <Route path="/about" component={About}/>
    </Route>
  </Router>
  ), document.getElementById('root'));