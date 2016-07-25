var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');

import { Link } from 'react-router'
var loginOverlay = require('./loginOverlay');



var getUser = function(){
  
  return axios.get('/getUser')
  
}

var getGame = function(){

  return axios.get('/getGame')
  
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
      
    axios.all([getUser(),getGame()])
      .then(axios.spread(function(userData,gameData){
        this.setState({
          username:userData.username,
          alreadyLoggedIn:userData.alreadyLoggedIn,
          score:gameData.game.score,
          mode:gameData.game.mode,
          nLevel:gameData.game.nLevel
        })
      }))


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
  tempSaveData(){
    axios.post({
      url:'/tempSaveData',
      data:{
        score: this.state.score,
        mode: this.state.mode,
        
      }
    })
  },
  gameOver: function(){

    axios.post({
      url:'/gameOver',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        inputUsername:this.state.username,
        alreadyLoggedIn:this.state.alreadyLoggedIn
      }
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
              <a onClick={this.gameOver}>
              <span className="fa fa-home fa-5x"></span>
              <h2>home</h2>
              </a>
            </Link>
            <h2 className="levelButton" onClick={this.click}>next level</h2>
            <div>
              <Link to="/leaderboard">
              <a onClick={this.gameOver}>
                <span className="lbChart">
                  <span className="fa fa-signal fa-5x"></span>
                  <h2>leaderboard</h2>
                </span>
              </a>
              </Link>
            </div>
          </div>
      </div>
    )
  }
});


module.exports = GameOverOverlay