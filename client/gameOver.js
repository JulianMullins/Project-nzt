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
      score:0,
      mode:null,
      nLevel:1
    }
  },
  componentDidMount(){
      
    fetch("/getGameData")
      .then(function(response){
        console.log(response)
        return response.json();
      }).then(function(response){
        this.setState({
          score:score,
          mode:mode,
          nLevel:nLevel
        })
      }.bind(this))


  },

  // componentDidMount(){
  //     getUser().bind(this);
  //     getScore().bind(this);
  // },

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
  click(e){
    this.props.history.push('/game/'+this.state.mode+'/'+(this.state.n+1))
  },
  render: function() {
    var loggedIn = this.state.alreadyLoggedIn

      ? <div></div>
      : <div className="gameOverPrompt">
          <p>It looks like you are not currently logged in. 
          <Link to="/gameOver/login"> Sign in</Link> or <Link to="/gameOver/register">sign up</Link> to save your progress, 
          view statistics and compete with friends!</p>  
        </div> 

    return (
      <div className="gameOver" id="gameover">
          <h1>Congrats!</h1>
          <h2>Your score is {this.state.score}</h2>
          <h1 className="gameOverInform classic">You have unlocked level 2</h1>

          {loggedIn}

          <div className="gameOverActions">
            <Link to="/home">
              <span className="fa fa-home fa-5x"></span>
              <h2>home</h2>
            </Link>
            <h2 className="levelButton" onClick={this.click}>next level</h2>
            <div>
              <Link to="/leaderboard">
                <span className="lbChart">
                  <span className="fa fa-signal fa-5x"></span>
                  <h2>leaderboard</h2>
                </span>
              </Link>
            </div>
          </div>
      </div>
    )
  }
});


module.exports = GameOverOverlay