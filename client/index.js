var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;

var LoginOverlay = require('./loginOverlay');
var RegisterOverlay = require('./registerOverlay');
var Mainmenu = require('./Mainmenu');
var GameOverOverlay = require('./gameOverOverlay');
var ClassicLevels = require('./levels').ClassicLevels;
var NavBar = require('./navBar');
var Leaderboard = require('./leaderboard');

var RelaxedMode = require('./relaxedMode');
var ClassicMode = require('./classicMode');
var SilentMode = require('./silentMode');
var AdvancedMode = require('./advancedMode');

var gameOver = function(score) {
  fetch('/gameOver', {
    method: 'post',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({score: score})
  })
}

ReactDOM.render(
  <Leaderboard/>, document.getElementById('root'));

