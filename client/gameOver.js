var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
var loginOverlay = require('./loginOverlay');



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

var getScore = function(){
  fetch('/getScore',{
    method:'get'
  }).then(function(response){
    return response.json();
  }).then(function(response){
    if(response.score){
      this.setState({
        score:response.score
      })
    }
  })
  
}

var GameOverOverlay = React.createClass({
  getInitialState:function(){  
    return{
      username:null,
      alreadyLoggedIn:false,
      score: null
    }
  },
  componentDidMount(){
      getUser().bind(this);
      getScore().bind(this);
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
          inputUsername:this.state.username,
          alreadyLoggedIn:this.state.alreadyLoggedIn
        })
      })
  },
  render: function() {
    var loggedIn = this.state.alreadyLoggedIn
      ? <Link to="/leaderboard"><button onClick={this.gameOver}>To Leaderboard</button></Link>
      : <div><input type="text" placeholder="username" name="username" id="username" value={this.state.username}></input>
            <br></br>
        <button><Link to="/login">Sign In</Link></button>
        <button><Link to="/leaderboard" onClick={this.gameOver}>Submit</Link></button></div>;
        
    return (
      <div className="gameOver" id="gameover">
          <h1>Congrats!</h1>
          <h2>Your score is {this.state.score}</h2>
          <h1>You have unlocked level 2</h1>

          <form>
            {loggedIn}
          </form>

          <div className="gameOverActions">
            <h2>home</h2>
            <h2>next level</h2>
            <h2>view leaderboard</h2>
          </div>
      </div>
    )
  }
});


module.exports = GameOverOverlay