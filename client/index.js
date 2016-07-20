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


<<<<<<< HEAD
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
=======
var gameOver = function(score){
  fetch('/gameOver', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        score: score
      })
    })
}

ReactDOM.render(
  <div>
      <Mainmenu/>
  </div>
  , document.getElementById('root'));

// ReactDOM.render(
//   <RelaxedMode/>, document.getElementById('root'));
>>>>>>> 774b5ae49f6130c2ed7ec9002a7fb65533062f36
