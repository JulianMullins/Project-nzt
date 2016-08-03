var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
var totalScore = 0;
var n = 0;
var score = 0;
var modeM = 0;

axios.defaults.baseURL = process.env.url;

import {Link} from 'react-router'
var loginOverlay = require('./loginOverlay');

var getUser = function() {
  return axios.get('/getUser');
}

var getGame = function() {
  return axios.get('/getGame');
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
      gameOverInform: <h2></h2>,
      gameOverCongrats: <h1></h1>,
      nextLevelLink: <div></div>,
      anonUserName: null,
      isHighScore: false,
      passedLevel: false,
      modeMultiplier: 0
    }
  },
  componentDidMount() {

    this.setScore();
    this.getData();
    //this.setState({firstRender: false})
  },
  setScore() {
    axios.get('/getScore').then(function(response) {
      this.setState({score: response.data.score})
    }.bind(this))
  },
  getData() {
    axios.all([getUser(), getGame()]).then(axios.spread(function(userData, gameData) {
      console.log("gameData: ", gameData);
      console.log("userData: ", userData);
      this.setState({
        //username:userData.data.username,
        isAnon: userData.data.alreadyLoggedIn,
        score: Math.floor(gameData.data.game.score),
        mode: gameData.data.game.mode,
        nLevel: gameData.data.game.nLevel,
        scoreToPass: gameData.data.scoreToPass,
        passedLevel: gameData.data.passedLevel,
        isHighScore: gameData.data.game.isHighScore,
        modeMultiplier: gameData.data.modeMultiplier,
        start: 0
      })
    }.bind(this))).then(function() {
      this.renderLogin();
      this.unlockLevel();
      this.anonHighScore();
      this.renderLogin();
      this.nextLevelBtn();
      score = parseFloat(this.state.score);
      var n = parseInt(this.state.nLevel);
      var modeM = parseInt(this.state.modeMultiplier);
      var totalScore = parseInt(score * n * modeM);
      this.setState({countUp: this.countUp(totalScore)})
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
    if (this.state.passedLevel) {
      this.setState({
        gameOverInform: <h2 className="classic">You have unlocked level {this.state.nLevel + 1}</h2>,
        gameOverCongrats: <h1>Congrats!</h1>
      })
    } else {
      this.setState({
        gameOverInform: <h2 className="classic">You need {this.state.scoreToPass * this.state.nLevel * this.state.modeMultiplier}
          points to unlock level {this.state.nLevel + 1}</h2>,
        gameOverCongrats: <h1>Nice try!</h1>
      })
    }
    console.log("state: ", this.state);
  },
  anonHighScore() {
    //if anon get high score, can save with tempusername, or login
    if (this.state.isAnon && this.state.isHighScore) {
      this.setState({
        gameOverMessage: <p>You earned a high score on our overall leaderboards. If you wish to be added to the leaderboard without logging in, provide a name below to display with your score
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
    if (this.state.isAnon) {
      this.setState({
        gameOverMessage: <div className="gameOverPrompt">
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
  nextLevelBtn() {
    if (this.state.passedLevel) {
      this.setState({
        nextOrReplay: <h2 className="levelButton" onClick={this.nextLevelLink}>next level</h2>
      })
    } else {
      this.setState({
        nextOrReplay: <h2 className="levelButton" onClick={this.repeatLevel}>replay level</h2>
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
  countUp: function(count) {
    var div_by = 100;
    console.log(count, 'count')
    //count=parseInt(count)
    var speed = parseFloat(count / div_by);
    //console.log('ini speed', speed);
    var display = $('.count');
    var run_count = 1;
    var int_speed = 18;

    var int = setInterval(function() {
      if (run_count < div_by) {
        display.text(parseInt(speed * run_count));
        run_count++;
      } else if (parseInt(display.text) < count) {
        var curr_count = parseInt(display.text) + 1;
      } else {
        display.text(count)
        clearInterval(int);
      }
    }, int_speed);

  },
  render: function() {
    return (
      <div className="gameOver" id="gameover">
        <div className="gameOverHeader">
          {this.state.gameOverCongrats}
          {this.state.gameOverInform}
        </div>
        <div className="scoreTable">
          <table>
            <tbody>
              <tr>
                <td>game score:
                </td>
                <td className="scoreValue">{this.state.score}</td>
              </tr>
              <tr>
                <td>n-level:
                </td>
                <td className="scoreValue">x {this.state.nLevel}</td>
              </tr>
              <tr>
                <td>mode:
                </td>
                <td className="scoreValue">x {this.state.modeMultiplier}</td>
              </tr>
              <tr className="totalScore">
                <td>total score:
                </td>
                <td className="count scoreValue">{this.state.countUp}</td>
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
          {this.state.nextOrReplay}
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
