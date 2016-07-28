var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
axios.defaults.baseURL = process.env.url;

import {Link} from 'react-router'
var loginOverlay = require('./loginOverlay');

var getUser = function() {

  return axios.get('/getUser')

}

var getGame = function() {

  return axios.get('/getGame')

}

var GameOverOverlay = React.createClass({
  getInitialState: function() {
    return {
      username: null,
      alreadyLoggedIn: false,
      score: 0,
      mode: null,
      nLevel: 1,
      renderLogin: <div></div>,
      anonHighScore: <div></div>,
      anonUserName: null,
      anonGetHighScore: false
    }
  },
  componentDidMount() {

    // axios.all([getUser(),getGame()])
    //   .then(axios.spread(function(userData,gameData){
    //     this.setState({
    //       username:userData.data.username,
    //       alreadyLoggedIn:userData.data.alreadyLoggedIn,
    //       score:gameData.data.game.score,
    //       mode:gameData.data.game.mode,
    //       nLevel:gameData.data.game.nLevel
    //     })
    //     console.log(userData,gameData)
    //     console.log("component mounted")
    //   }.bind(this)))
    this.getData();

  },

  // componentDidMount(){
  //     getUser().bind(this);
  //     getScore().bind(this);
  // },
  getData() {
    axios.all([getUser(), getGame()]).then(axios.spread(function(userData, gameData) {
      this.setState({username: userData.data.username, alreadyLoggedIn: userData.data.alreadyLoggedIn, score: gameData.data.game.score, mode: gameData.data.game.mode, nLevel: gameData.data.game.nLevel})
    }.bind(this))).then(function() {
      this.renderLogin()
    }.bind(this))
  },
  // update:function(e){
  //   this.setState({
  //     username: e.target.value
  //   })
  // },
  tempSaveData() {
    axios.post({
      url: '/tempSaveData',
      data: {
        score: this.state.score,
        mode: this.state.mode
      }
    })
  },
  gameOver: function() {
    axios.post({
      url: '/gameOver',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        inputUsername: this.state.username,
        alreadyLoggedIn: this.state.alreadyLoggedIn
      }
    })

  },
  click(e) {

    //ONLY IF EARNED

    //go to next level (if earned)
    this.props.history.push('/game/' + this.state.mode + '/' + (this.state.nLevel + 1))
  },
  anonHighScore() {

    //get isOverallHighScore

    //if anon get high score, can save with tempusername, or login
    if (anonGetHighScore) {
      this.setState({
        anonHighScore: <p>You earned a high score on our overall leaderboards. If you wish to be added to the leaderboard and without logging in, provide a name below to display with your score
            <form>
              <input type='text' name="anonUserName" onChange={this.update}/>
              <Link onClick={this.anonLeaderboard} to="/leaderboard" type="button">Submit</Link>
            </form>
            Or, you can
            <Link to="/gameOver/login">
              login</Link>
            or
            <Link to="/gameOver/register">sign up</Link>
            to save your progress, view statistics and compete with friends!
          </p>
      })
    }

  },
  renderLogin() {

    //if not logged in, option to login to save
    if (!this.state.alreadyLoggedIn && !anonGetHighScore) {
      this.setState({
        renderLogin: <div className="gameOverPrompt">
            <p>It looks like you are not currently logged in.
              <Link to="/gameOver/login">
                Sign in</Link>
              or
              <Link to="/gameOver/register">sign up</Link>
              to save your progress, view statistics and compete with friends!
            </p>
          </div>
      })
    }
  },
  update(e) {

    //update anonusername field
    this.setState({anonUserName: e.target.value})
  },
  anonLeaderboard() {

    //save anon score

    axios.post('/postAnonScore', {
      withCredentials: true,
      data: {
        anonUserName: this.state.anonUserName
      }
    })

  },
  render: function() {
    // this.getData();

    // var loggedIn = this.state.alreadyLoggedIn

    //   ? <div></div>
    //   : <div className="gameOverPrompt">
    //       <p>It looks like you are not currently logged in.
    //       <Link to="/gameOver/login"> Sign in</Link> or <Link to="/gameOver/register">sign up</Link> to save your progress,
    //       view statistics and compete with friends!</p>
    //     </div>

    return (
      <div className="gameOver" id="gameover">
        <h1>Congrats!</h1>
        <h2>Your score is {this.state.score}</h2>
        <h1 className="gameOverInform classic">You have unlocked level 2</h1>

        {this.state.renderLogin}
        {this.state.anonHighScore}

        <div className="gameOverActions">
          <Link to="/home" onClick={this.gameOver}>
            <span className="fa fa-home fa-5x"></span>
            <h2>home</h2>
          </Link>
          <h2 className="levelButton" onClick={this.click}>next level</h2>
          <div>
            <Link to="/leaderboard" onClick={this.gameOver}>
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
