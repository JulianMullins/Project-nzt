var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;

var MenuOverlay = require('./menuOverlay');
var LoginOverlay = require('./loginOverlay');
var RegisterOverlay = require('./registerOverlay');
var Mainmenu = require('./Mainmenu');
var GameOverOverlay = require('./gameOverOverlay');
var Levels = require('./levels').Levels;
var NavBar = require('./navBar');

var RelaxedMode = require('./relaxedMode');
var ClassicMode = require('./classicMode');
var SilentMode = require('./silentMode');
var AdvancedMode = require('./advancedMode');


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

<<<<<<< HEAD
ReactDOM.render(
  <div>
      <Mainmenu/>
  </div>
  , document.getElementById('root'));

// ReactDOM.render(
//   <RelaxedMode/>, document.getElementById('root'));
=======

// ReactDOM.render(
//   <div>
//       <Mainmenu/>
//   </div>
//   , document.getElementById('root'));

ReactDOM.render(
  <RelaxedMode/>, document.getElementById('root'));
>>>>>>> refs/remotes/origin/tconcannon
