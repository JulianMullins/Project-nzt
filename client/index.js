var React = require('react');
var ReactDOM = require('react-dom');

import {Router, Route, hashHistory, Link} from 'react-router';
import { IndexRoute, IndexRedirect } from 'react-router';
var axios = require('axios');
var url = process.env.url;

var Home = require('./Mainmenu');
var NavBar = require('./navBar');

var Login = require('./loginOverlay');
var FacebookLogin = require('./facebookLogin');
var Logout = require('./logout');
var Register = require('./registerOverlay');

var GameOver = require('./gameOver');
var Leaderboard = require('./leaderboard');
var Stats = require('./stats');
var Contact = require('./contact');
var Science = require('./science');
var Tutorial = require('./tutorial');


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


var App = React.createClass({
  getInitialState(){
    // var isUser = null;
    // axios({
    //   url: '/isUser',
    //   withCredentials: true
    // }).then(function(response){
    //   if(response.data.isUser){
    //     isUser = true;
    //   }
    //   else{
    //     isUser = false;
    //   }
    // }.bind(this))
    return{
      
    }
  },
  componentDidMount() {
    
    console.log("app mounted")
  },
  render() {
    console.log(this) 
    return (
      <div>

        <NavBar />
        {this.props.children}

      </div>
    )
  }
});

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>

      <IndexRedirect to='/home'/>
      <Route path="home" component={Home} />

      <Route path="login/facebook" component={FacebookLogin}/>
      <Route path="gameOver/login" component={Login}/>
      <Route path="gameOver/register" component={Register}/>
      <Route path="login" component={Login}/>
      <Route path="logout" component={Logout}/>

      <Route path="register" component={Register}/>
      <Route path="gameOver" component={GameOver}/>
      <Route path="leaderboard" component={Leaderboard}/>
      <Route path="stats" component={Stats}/>
      <Route path="contact" component={Contact}/>
      <Route path="science" component={Science}/>

      <Route path="tutorial" component={Tutorial}/>

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

// ReactDOM.render(<GameOver/>, document.getElementById('root'));
