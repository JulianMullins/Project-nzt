var React = require('react');
var Reactable = require('reactable');
var Reactable = Reactable.Table;
var axios = require('axios');
import {Link} from 'react-router';

var Leaderboard = React.createClass({
  getInitialState: function() {
    return {
      allScores: [],
      friendsScores: [],
      myScores: [],
      scoreBoard: [
        1, 0, 0
      ],
      hasScores: false,
      username: null
    }
  },
  componentDidMount: function() {
    this.getAllScores();
    this.getFriendsScores();
    this.getMyScores();
  },
  getAllScores: function() {
    axios.get('/api/allHighScores').then(function(response) {
      this.setState({allScores: response.data.data, username: response.data.username});
    }.bind(this));
  },
  getFriendsScores() {
    axios.get('/api/friendScores').then(function(response) {
      this.setState({friendsScores: response.data.data});
    }.bind(this))
  },
  getMyScores: function() {
    axios.get('/api/myHighScores').then(function(response) {
      if (!response.data.success) {
        this.setState({hasScores: false})
        return;
      }
      this.setState({myScores: response.data.data});
      if (response.data.data[0]) {
        this.setState({hasScores: true})
      } else {
        this.setState({hasScores: false})
      }
    }.bind(this));
  },
  globalHighlightMyScores: function(username) {
    $(document).ready(function() {
      $('.reactable-data tr').map(function(tr) {
        setTimeout(function() {
          $($('.reactable-data tr')[tr]).css('backgroundColor', 'transparent');
          if ($('.reactable-data tr')[tr].children[1].innerText == username) {
            $($('.reactable-data tr')[tr]).css('backgroundColor', 'rgba(1, 182, 167, 0.1)');
          }
        }.bind(this));
      }.bind(this), 1000);
    }.bind(this))
  },
  render: function() {
    this.globalHighlightMyScores(this.state.username)
    var loggedIn = !this.state.hasScores && !this.state.scoreBoard[0]
      ? (
        <div className="gameOverPrompt">
          <p>
            <Link to="/login">Login </Link>
            or
            <Link to="/register"> Sign Up </Link>
            to save your progress, view statistics and compete with friends!
          </p>
        </div>
      )
      : <div></div>;

    var fbConnected = !this.state.friendsScores && this.state.scoreBoard[1] && this.state.hasScores
      ? (
        <div className="gameOverPrompt">
          <p>
            <Link to="/gameOver/login">Login</Link>
            or
            <Link to="/gameOver/register">Connect</Link>
            with facebook to compete with friends!
          </p>
        </div>
      )
      : <div></div>;

    var scores;
    if (this.state.scoreBoard[0]) {
      scores = this.state.allScores;
    } else if (this.state.scoreBoard[1]) {
      scores = this.state.friendsScores;
    } else {
      scores = this.state.myScores;
    }

    return (
      <div className="leaderboardPage">
        <div className="board">
          <h1 className="lbHeader">Leaderboards</h1>
          <section>
            <div className="leaderboardButtons">
              <a onClick={function() {
                this.setState({
                  scoreBoard: [1, 0, 0]
                });
              }.bind(this)} style={this.state.scoreBoard[0]
                ? pressedStyle
                : {}}>Global</a>
              <a onClick={function() {
                this.setState({
                  scoreBoard: [0, 1, 0]
                })
              }.bind(this)} style={this.state.scoreBoard[1]
                ? pressedStyle
                : {}}>Friends</a>
              <a onClick={function() {
                this.setState({
                  scoreBoard: [0, 0, 1]
                })
              }.bind(this)} style={this.state.scoreBoard[2]
                ? pressedStyle
                : {}}>Personal</a>
            </div>
            <Reactable columns={!this.state.scoreBoard[2]
              ? (this.state.scoreBoard[0] ? columns.slice(0, 5) : columns.slice(0, 1).concat([{key:'name', label:'name'}]).concat(columns.slice(2, 5)))
              : columns.slice(0, 1).concat(columns.slice(2))} data={scores} currentPage={0} itemsPerPage={10} pageButtonLimit={5} sortable={true} defaultSort={{
              column: 'rank',
              direction: 'asc'
            }} filterable={this.state.scoreBoard[2]
              ? []
              : ['username']} filterPlaceholder={this.state.scoreBoard[2]
              ? ''
              : 'Search by username'} onPageChange={function() {
              this.globalHighlightMyScores(this.state.username);
            }.bind(this)}/>

          </section>
          {loggedIn}
        </div>
        <Link to="/home"><img className="whiteLogo" src="./images/CortexLogo3.png"/></Link>
      </div>
    )
  }
});

var pressedStyle = {
  backgroundColor: '#01b6a7',
  color: 'white'
}

var columns = [
  {
    key: 'rank',
    label: 'rank'
  }, {
    key: 'username',
    label: 'name'
  }, {
    key: 'score',
    label: 'score'
  }, {
    key: 'mode',
    label: 'mode'
  }, {
    key: 'level',
    label: 'Level'
  }, {
    key: 'date',
    label: 'date'
  }
]

module.exports = Leaderboard
