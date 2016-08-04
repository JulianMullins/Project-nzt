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
      baseScore: 0,
      fullScore: 0,
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
    if (this.state.baseScore === 0) {
      this.setState({fullScore: 0})
    }
    //this.setState({firstRender: false})
  },
  setScore() {
    axios.get('/getScore').then(function(response) {
      this.setState({
        baseScore: Math.floor(response.data.baseScore),
        fullScore: Math.floor(response.data.fullScore)
      })
    }.bind(this))
  },
  getData() {
    axios.all([getUser(), getGame()]).then(axios.spread(function(userData, gameData) {
      console.log("gameData: ", gameData);
      console.log("userData: ", userData);
      this.setState({
        //username:userData.data.username,
        isAnon: userData.data.isAnon,
        mode: gameData.data.game.mode,
        nLevel: gameData.data.game.nLevel,
        scoreToPass: gameData.data.scoreToPass,
        passedLevel: gameData.data.passedLevel,
        isHighScore: gameData.data.game.isHighScore,
        modeMultiplier: gameData.data.modeMultiplier,
        start: 0
      })
    }.bind(this))).then(function() {
      this.unlockLevel();
      this.anonHighScore();
      this.nextLevelBtn();
      score = parseFloat(this.state.fullScore);
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
        gameOverInform: <h2 className="classic">You need {this.state.scoreToPass * this.state.nLevel * this.state.modeMultiplier} points 
        to unlock level {this.state.nLevel + 1}</h2>,
        gameOverCongrats: <h1>Nice try!</h1>
      })
    }
    console.log("state: ", this.state);
  },
  anonHighScore() {
    //if anon get high score, prompt to login
    if (this.state.isAnon && this.state.isHighScore) {
      this.setState({gameOverMessage: (
          <div className="gameOverPrompt">
            <p>You have earned a high score on the global leaderboard!</p>
            <p><Link to="/gameOver/login">Login </Link>or<Link to="/gameOver/register"> Sign Up </Link>
              to save your progress, view statistics and compete with friends!</p>
          </div>
        )})
    } else if (this.state.isAnon && !this.state.isHighScore) {
      this.setState({gameOverMessage: (
          <div className="gameOverPrompt">
            <p><Link to="/gameOver/login">Login </Link>or<Link to="/gameOver/register"> Sign Up </Link>
              to save your progress, view statistics and compete with friends!</p>
          </div>
        )})
    } else if (!this.state.isAnon && this.state.isHighScore) {
      this.setState({gameOverMessage: (
          <div className="gameOverPrompt">
            <p>You have earned a high score on the global leaderboard!</p>
          </div>
        )})
    } else if (!this.state.isAnon && !this.state.isHighScore) {
      this.setState({gameOverMessage: (
          <div></div>
        )})
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
    console.log(!this.state.fullScore);
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
                <td className="scoreValue">{this.state.baseScore}</td>
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
                <td className="count scoreValue">{!this.state.fullscore ? 0 : this.countUp(this.state.fullScore)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {this.state.gameOverMessage}
        <div className="gameOverActions">
          <Link onClick={this.gameOver} className="homeLink" to="/home">
            <span className="fa fa-home fa-5x"></span>
            <h2>home</h2>
          </Link>
          {this.state.nextOrReplay}
          <div>
            <Link onClick={this.gameOver} className="leaderLink" to="/leaderboard">
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
