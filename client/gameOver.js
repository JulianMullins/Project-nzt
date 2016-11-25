var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
var totalScore = 0;
var n = 0;
var score = 0;
var modeM = 0;

axios.defaults.baseURL = process.env.url;

import {Link} from 'react-router'
var loginOverlay = require('./login');

var getUser = function() {
  return axios.get('/api/getUser');
}

var getGame = function() {
  return axios.get('/api/getGame');
}

var getMaxN = function() {
  return axios.get('/api/getMaxN');
}



var GameOverOverlay = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      //username:null,
      isAnon: false,
      baseScore: 0,
      fullScore: 0,
      mode: null,
      nLevel: 1,
      maxN: null,
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
    // if(this.setScore()){
    //   console.log("WHEE")
    //   this.getData();
      
    // }
    //this.setState({firstRender: false})
  },
  setScore() {
    axios.get('/api/getScore').then(function(response) {
      if(response.data.error){
        this.context.router.goBack();
        console.log('false')
        return false;
      }
      else{
        this.setState({
          baseScore: parseInt(response.data.baseScore),
          fullScore: parseInt(response.data.fullScore)
        })
        console.log('true')
        return true;
      }
    }.bind(this))
  },
  getData() {
    axios.all([getUser(), getGame(), getMaxN()]).then(axios.spread(function(userData, gameData, maxN) {
      // console.log("gameData: ", gameData);
      // console.log("userData: ", userData);
      // console.log('maxN: ', maxN);
      this.setState({
        //username:userData.data.username,
        isAnon: userData.data.isAnon,
        mode: gameData.data.game.mode,
        nLevel: gameData.data.game.nLevel,
        maxN: maxN.data.maxN,
        scoreToPass: gameData.data.scoreToPass,
        passedLevel: gameData.data.passedLevel,
        isHighScore: gameData.data.game.isHighScore,
        modeMultiplier: gameData.data.modeMultiplier,
        start: 0,
        accuracy: gameData.data.accuracy
      })
    }.bind(this))).then(function() {
      this.unlockLevel();
      this.anonHighScore();
      this.nextLevelBtn();
      score = parseFloat(this.state.fullScore);
      var n = parseInt(this.state.nLevel);
      var modeM = parseInt(this.state.modeMultiplier);
      this.setState({countUp: this.countUp(score)})
    }.bind(this))
  },

  unlockLevel() {
    if (this.state.passedLevel) {
      this.setState({
        gameOverInform: <h2 className="classic">You have unlocked level {this.state.nLevel + 1}</h2>,
        gameOverCongrats: <h1>Congrats!</h1>
      })
    } else {
      this.setState({
        gameOverInform: <h2 className="classic">You need {this.state.scoreToPass} points
        to unlock level {this.state.nLevel + 1}</h2>,
        gameOverCongrats: <h1>Nice try!</h1>
      })
    }
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
    axios.post('/api/postAnonScore', {
      withCredentials: true,
      data: {
        anonUserName: this.state.anonUserName
      }
    })

  },
  nextLevelBtn() {
    if (this.state.passedLevel && this.state.mode!=='advanced') {
      this.setState({
        nextOrReplay: <h2 className="levelButton" onClick={this.nextLevelLink}>next mode</h2>
      })
    } 
    else if(this.state.passedLevel && this.state.mode==='advanced'){
      this.setState({
        nextOrReplay: <h2 className="levelButton" onClick={this.nextLevelLink}>next level</h2>
      })
    }
    else {
      this.setState({
        nextOrReplay: null
      })
    }
  },
  nextLevelLink(e) {

    //go to next level (if earned)
    //if this.state.maxN."mode" > this.state.nLevel
    if(this.state.mode=='relaxed'){
      if(this.state.maxN.silent >= this.state.nLevel) {
        this.context.router.push('/game/silent/' + (this.state.nLevel));
      } else {
        this.context.router.push('/game/silent/' + (this.state.maxN.silent))
      }
    }
    else if(this.state.mode=='silent'){
      if(this.state.maxN.classic >= this.state.nLevel) {
        this.context.router.push('/game/classic/' + (this.state.nLevel))
      } else {
        this.context.router.push('/game/classic/' + (this.state.maxN.classic))
      }
    }
    else if(this.state.mode=='classic'){
      if(this.state.maxN.relaxed > this.state.nLevel) {
        this.context.router.push('/game/relaxed/'+(this.state.nLevel+1))
      } else {
        this.context.router.push('/game/classic/' + (this.state.maxN.relaxed))
      }
    }
    else{
      this.context.router.push('/game/advanced/'+ (this.state.nLevel+1))
    }
  },
  repeatLevel(e) {
    //go to next level (if earned)
    this.context.router.push('/game/' + this.state.mode + '/' + (this.state.nLevel))
  },
  countUp: function(count) {
    var div_by = 100;
    var speed = parseFloat(count / div_by);
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
                <td className="count scoreValue">{!this.state.fullscore
                    ? this.state.baseScore * this.state.nLevel * this.state.modeMultiplier
                    : this.countUp(this.state.fullScore)}</td>
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
          <h2 className="levelButton" onClick={this.repeatLevel}>replay level</h2>
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
