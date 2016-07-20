var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
var loginOverlay = require('./loginOverlay');



// ADAM - I need a function to pull up the login overlay when you click sign in



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

var GameOverOverlay = React.createClass({
  getInitialState:function(){
    return{
      username:null
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
          inputUsername:this.state.username
        })
      })
  },
  signIn: function(){
    //fetch('/')
  },
  render: function() {
    return (
      <div className="overlay" id="gameover">
        <center>
          <form>
            <h1>Game Over</h1>
            <input type="text" placeholder="username" name="username" id="username" value={this.state.username}></input>
            <br></br>
            <button>Submit</button>
            <br></br>
            <button><Link to="/login">Sign In</Link></button>
          </form>
        </center>
      </div>
    )
  }
});


module.exports = GameOverOverlay