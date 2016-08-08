var React = require('react');
var ReactDOM = require('react-dom');

import {Router, Route, hashHistory, Link} from 'react-router';
import { IndexRoute, IndexRedirect } from 'react-router';
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
var Stats = require('./statsLineGraphs');

console.timeStamp("games start");
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

    return{
      isUser:false,
      isloggedin:false
    }
  },
  componentDidMount() {
    
    console.log("app mounted")

    axios.get('/getUserOnLoad')
      // .then(function(response){
      // }.bind(this))

  },
  updateState(){
    // axios.get('/isUser')
    //   .then(function(response){
    //     this.setState({
    //       isUser: response.data.isUser,
    //       isloggedin: response.data.isloggedin
    //     })
    //   }.bind(this))
  },
  render() {
            //<NavBar loginFunction={this.updateState} isUser={this.state.isUser} isloggedin={this.state.isloggedin} />

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
      <Route path="/newUser" component={NewUserOverlay} />

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
      <Route path="stats" component={Stats}/>
      <Route path="tutorial" component={Tutorial}/>

      <Route path="levels/classic(/:error)" component={ClassicLevels}/>
      <Route path="levels/relaxed(/:error)" component={RelaxedLevels}/>
      <Route path="levels/silent(/:error)" component={SilentLevels}/>
      <Route path="levels/advanced(/:error)" component={AdvancedLevels}/>
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

// ReactDOM.render(<GameOver/>, document.getElementById('root'));
