var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
var loginOverlay = require('./loginOverlay');

// ADAM - I need a function to pull up the login overlay when you click sign in



var getUser = function(){
  fetch('/getUser',{
      method:'get'
    }).then(function(response){
        return response.json();
    }).then(function(response){
      if(response.username){
        this.setState({
          username:response.username,
          alreadyLoggedIn:true
        })
      }
    })
}

var GameOverOverlay = React.createClass({
  getInitialState:function(){  
    return{
      username:null,
      alreadyLoggedIn:false
    }
  },
  update:function(e){
    this.setState({
      username: e.target.value
    })
  },
  gameOver: function(score){

    fetch('/gameOver', {
        method: 'post',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          score: this.props.score,
          inputUsername:this.state.username,
          alreadyLoggedIn:this.state.alreadyLoggedIn
        })
      })
  },
  render: function() {
    getUser().bind(this);

    var loggedIn = this.state.alreadyLoggedIn
      ? ''
      : <div><input type="text" placeholder="username" name="username" id="username" value={this.state.username}></input>
            <br></br>
        <button><Link to="/login">Sign In</Link></button></div>;

    return (
      <div className="overlay" id="gameover">
        <center>
          <form>
            <h1>Game Over</h1>
            <h2>{score}</h2>
           
            <button><Link to="/leaderboard" onClick={this.gameOver}>Submit</Link></button>
            <br></br>
            {loggedIn}
          </form>
        </center>
      </div>
    )
  }
});


module.exports = GameOverOverlay