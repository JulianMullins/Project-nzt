var React = require('react');
var ReactDOM = require('react-dom');

import {Router, Route, hashHistory, Link} from 'react-router';
import {IndexRoute, IndexRedirect} from 'react-router';
var axios = require('axios');
var url = process.env.url;

var Home = require('./home');
var NavBar = require('./navBar');
var NewUserOverlay = require('./newUserOverlay');

var Login = require('./login');
var FacebookLogin = require('./facebookLogin');
var Logout = require('./logout');
var Register = require('./register');

var ErrorPage = require('./errorPage');

var GameOver = require('./gameOver');
var Leaderboard = require('./leaderboard');
var Contact = require('./contact');
var Science = require('./science');
var Tutorial = require('./tutorial');

console.timeStamp("stats start");
//var Stats = require('./statsLineGraphs');
console.timeStamp("games start");

var RelaxedGame = require('./Modes/relaxedMode');
var ClassicGame = require('./Modes/classicMode');
var SilentGame = require('./Modes/silentMode');
var AdvancedGame = require('./Modes/advancedMode');

var LevelOverlay = require('./levels').LevelOverlay;

var App = React.createClass({
  getInitialState: function() {
    return {isUser: false, isloggedin: false}
  },
  componentDidMount: function() {
    console.log("app mounted")
    axios.get('/getUserOnLoad')
  },
  updateState: function() {
    // axios.get('/isUser')
    //   .then(function(response){
    //     this.setState({
    //       isUser: response.data.isUser,
    //       isloggedin: response.data.isloggedin
    //     })
    //   }.bind(this))
  },
  render: function() {
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

      <IndexRedirect to='/home'/>
      <Route path="home" component={Home}/>
      <Route path="/newUser" component={NewUserOverlay}/>

      <Route path="login/facebook/success" component={FacebookLogin}/>
      <Route path="gameOver/login/facebook/success" component={FacebookLogin}/>
      <Route path="gameOver/login/facebook(/:error)" component={FacebookLogin}/>
      <Route path="gameOver/login(/:error)" component={Login}/>
      <Route path="gameOver/register(/:error)" component={Register}/>
      <Route path="login(/:error)" component={Login}/>
      <Route path="logout" component={Logout}/>
      <Route path="register(/:error)" component={Register}/>
      <Route path="error/:error" component={ErrorPage}/>

      <Route path="gameOver" component={GameOver}/>
      <Route path="leaderboard" component={Leaderboard}/>

      <Route path="contact" component={Contact}/>
      <Route path="science" component={Science}/>
      <Route path="tutorial" component={Tutorial}/>

      <Route path="levels/classic(/:error)" component={LevelOverlay}/>
      <Route path="levels/relaxed(/:error)" component={LevelOverlay}/>
      <Route path="levels/silent(/:error)" component={LevelOverlay}/>
      <Route path="levels/advanced(/:error)" component={LevelOverlay}/>
      <Route path="game/classic/:n" component={ClassicGame}/>
      <Route path="game/relaxed/:n" component={RelaxedGame}/>
      <Route path="game/silent/:n" component={SilentGame}/>
      <Route path="game/advanced/:n" component={AdvancedGame}/>

    </Route>
  </Router>
), document.getElementById('root'), function() {
  console.log("rendered")
});

//<Route path="stats" component={Stats}/>
