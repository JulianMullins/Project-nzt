var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
axios.defaults.baseURL = process.env.url;


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
          //username:null,
          isAnon:false,
          score:0,
          mode:null,
          nLevel:1,
          gameOverMessage: <div></div>,
          nextLevelLink:<div></div>,
          anonUserName:null,
          isHighScore:false,
          passedLevel:false
        }
  },
  componentDidMount(){

    this.getData();
    this.unlockLevel();
    this.anonHighScore();
    this.renderLogin();
    this.nextLevelBtn();

  },

  getData(){
    axios.all([getUser(),getGame()])
      .then(axios.spread(function(userData,gameData){
        this.setState({
          //username:userData.data.username,
          isAnon:userData.data.alreadyLoggedIn,
          score:gameData.data.game.score,
          mode:gameData.data.game.mode,
          nLevel:gameData.data.game.nLevel,
          passedLevel: gameData.data.game.passedLevel,
          isHighScore: gameData.data.game.isHighScore
        })
      }.bind(this)))
      .then(function(){
        this.renderLogin()
      }.bind(this))
  },

  gameOver: function(){
    // axios.post({
    //   url:'/gameOver',
    //   headers:{
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   data: {
    //     inputUsername:this.state.username,
    //     alreadyLoggedIn:this.state.isAnon
    //   }
    // })

  },
  unlockLevel(){
    if(this.state.isHighScore){
      this.setState({
        gameOverMessage: <h1 className="gameOverInform classic">You have unlocked level 2</h1>
      })
    }
  },
  anonHighScore(){
    //if anon get high score, can save with tempusername, or login
    if(this.state.isAnon && this.state.isHighScore){
      this.setState({
        gameOverMessage: <p>You earned a high score on our overall leaderboards.
          If you wish to be added to the leaderboard and without logging in, 
          provide a name below to display with your score
          <form>
            <input type='text' name="anonUserName" onChange={this.update} />
            <Link onClick={this.anonLeaderboard} to="/leaderboard" type="button">Submit</Link>
          </form>
            Or, you can <Link to="/gameOver/login"> login</Link> or <Link to="/gameOver/register">sign up</Link> to save your progress, 
            view statistics and compete with friends!
          </p>
      })
    }
    
  },
  renderLogin(){

    //if not logged in, option to login to save
    if(!this.state.isAnon && !this.state.isHighScore){
      this.setState({
        gameOverMessage: <div className="gameOverPrompt">
          <p>It looks like you are not currently logged in. 
          <Link to="/gameOver/login"> Sign in</Link> or <Link to="/gameOver/register">sign up</Link> to save your progress, 
          view statistics and compete with friends!
          </p> 
        </div>
      })
    }
  },
  update(e){

    //update anonusername field
    this.setState({
      anonUserName: e.target.value
    })
  },
  anonLeaderboard(){

    //save anon score

    axios.post('/postAnonScore',{
      withCredentials:true,
      data:{
        anonUserName:this.state.anonUserName,

      }
    })

  },
  nextLevelBtn(){
    if(this.state.passedLevel){
      this.setState({
        nextLevel: <h2 className="levelButton" onClick={this.nextLevelLink}>next level</h2>
      })
    }
  },
  nextLevelLink(e){
   //go to next level (if earned)
    this.props.history.push('/game/'+this.state.mode+'/'+(this.state.nLevel+1))
  },
  repeatLevel(e){
   //go to next level (if earned)
    this.props.history.push('/game/'+this.state.mode+'/'+(this.state.nLevel))
  },
  render: function() {

    return (
      <div className="gameOver" id="gameover">
          <h1>Congrats!</h1>
          <h2>Your score is {this.state.score}</h2>

          {this.state.gameOverMessage}

          <div className="gameOverActions">
            <Link to="/home">
              <a onClick={this.gameOver}>
              <span className="fa fa-home fa-5x"></span>
              <h2>home</h2>
              </a>
            </Link>

            {this.state.nextLevel}

            <h2 className="levelButton" onClick={this.repeatLevel}>replay level</h2>
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