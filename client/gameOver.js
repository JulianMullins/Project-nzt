var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
var totalScore=0;
var n=0;
var score=0;
var modeM=0;

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
      //username:null,
      isAnon: false,
      score: 0,
      mode: null,
      nLevel: 1,
      gameOverMessage: <div></div>,
      nextLevelLink: <div></div>,
      anonUserName: null,
      isHighScore: false,
      passedLevel: false
    }
  },
  componentDidMount() {

    this.setScore();
    this.getData();
    this.unlockLevel();
    this.anonHighScore();
    this.renderLogin();
    this.nextLevelBtn();
    //this.setState({firstRender: false})

  },
  setScore() {
    axios.get('/getScore').then(function(response) {
      this.setState({score: response.data.score})
    }.bind(this))
  },
  getData() {
    axios.all([getUser(), getGame()]).then(axios.spread(function(userData, gameData) {
      this.setState({
        //username:userData.data.username,
        isAnon: !userData.data.alreadyLoggedIn,
        score: Math.floor(gameData.data.game.score),
        mode: gameData.data.game.mode,
        nLevel: gameData.data.game.nLevel,
        passedLevel: gameData.data.game.passedLevel,
        isHighScore: gameData.data.game.isHighScore,
        modeMultiplier: gameData.data.modeMultiplier,
        start: 0
      })
      //console.log(this.state,'data')
    }.bind(this))).then(function() {
      this.renderLogin()
    //console.log(this.state,'this.state')
    score = parseFloat(this.state.score);
    console.log(score,'score')
    var n = parseInt(this.state.nLevel);
    console.log(n,'n')
    var modeM = parseInt(this.state.modeMultiplier);
    console.log(modeM,'modeM')
    var totalScore = parseInt(score*n*modeM);
    console.log(totalScore,'totalScore')
    this.setState({
      start: this.countUp(totalScore)
    })
    }.bind(this))
  },

  gameOver: function() {
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
  unlockLevel() {
    if (this.state.isHighScore) {
      this.setState({
        gameOverMessage: <h1 className="gameOverInform classic">You have unlocked level 2</h1>
      })
    }
  },
  anonHighScore() {
    //if anon get high score, can save with tempusername, or login
    if (this.state.isAnon && this.state.isHighScore) {
      this.setState({
        gameOverMessage: <p>You earned a high score on our overall leaderboards. If you wish to be added to the leaderboard and without logging in, provide a name below to display with your score
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
    if (this.state.isAnon && !this.state.isHighScore) {
      this.setState({
        gameOverMessage:
          <div className="gameOverPrompt">
            <p>It looks like you are not currently logged in. 
            <Link to="/gameOver/login"> Sign in</Link> or <Link to="/gameOver/register">sign up</Link> to save your progress, 
            view statistics and compete with friends!
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
  nextLevelBtn() {
    if (this.state.passedLevel) {
      this.setState({
        nextLevel: <h2 className="levelButton" onClick={this.nextLevelLink}>next level</h2>
      })
    }
  },
  nextLevelLink(e) {
    //go to next level (if earned)
    this.props.history.push('/game/' + this.state.mode + '/' + (this.state.nLevel + 1))
  },
  repeatLevel(e) {
    //go to next level (if earned)
    this.props.history.push('/game/' + this.state.mode + '/' + (this.state.nLevel))
  },
  countUp: function(count){

  },
  render: function() {
    var div_by = 100;
    console.log(count,'count')
    var speed = parseInt(count / div_by);
    console.log('ini speed', speed);
    var display = $('.count');
    var run_count = 1;
    var int_speed = 18;
  
    var int = setInterval(function() {
      if(run_count < div_by){
        display.text(speed * run_count);
        console.log('speed', speed, 'run', run_count);
        run_count++;
      } else if(parseInt(display.text) < count) {
        var curr_count = parseInt(display.text) + 1;
        console.log("current", curr_count);
        display.text(curr_count);
      } else {
        clearInterval(int);
      }
    }, int_speed);
  },
    return (
      <div className="gameOver" id="gameover">
          <div className="gameOverHeader">
              <h1>Congrats!</h1>
              <h2 className="classic">You have unlocked level {n+1}</h2>
          </div>
          <div className="scoreTable">
            <table>
              <tbody>
                <tr>
                  <td>game score: </td>
                  <td className="scoreValue">{score}</td>
                </tr>
                <tr>
                  <td>n-level: </td>
                  <td className="scoreValue">x {this.state.nLevel}</td>
                </tr>
                <tr>
                  <td>mode: </td>
                  <td className="scoreValue">x {modeM}</td>
                </tr>
                <tr className="totalScore">
                  <td>total score: </td>
                  <td className="count scoreValue">{this.state.start}</td>
                </tr>
              </tbody>
            </table>
          </div>
            {this.state.gameOverMessage}
          <div className="gameOverActions">
            <Link onClick={this.gameOver} to="/home">
              <span className="fa fa-home fa-5x"></span>
              <h2>home</h2>
            </Link>
            {this.state.nextLevel}
            <h2 className="levelButton" onClick={this.repeatLevel}>replay level</h2>
            <div>
              <Link onClick={this.gameOver} to="/leaderboard">
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
