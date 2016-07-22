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
      ? <div></div>
      : <div className="gameOverPrompt">
          <p>It looks like you are not currently logged in. 
          <Link to="/login">Sign in</Link> or <Link to="/register">sign up</Link> to save your progress, 
          view statistics and compete with friends!</p>  
        </div> 

    return (
      <div className="gameOver" id="gameover">
          <h1>Congrats!</h1>
          <h2>Your score is {this.state.score}</h2>
          <h1 className="gameOverInform">You have unlocked level 2</h1>

          {loggedIn}

          <div className="gameOverActions">
            <Link to="/home">
              <span className="fa fa-home fa-5x"></span>
            </Link>
            <h2 className="levelButton">next level</h2>
            <div>
              <Link to="/leaderboard">
                <span className="lbCharts">
                  <div className="lbChart1"></div>
                  <div className="lbChart2"></div>
                  <div className="lbChart3"></div>
                </span>
                <h2>view leaderboard</h2>
              </Link>
            </div>
          </div>
      </div>
    )
  }
});


module.exports = GameOverOverlay