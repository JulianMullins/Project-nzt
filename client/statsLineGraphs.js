var React = require('react');
var ReactDOM = require('react-dom');

console.timeStamp("start load require");

var Charts = require('react-d3-basic');
console.timeStamp("start load lineChart");
var LineChart = Charts.LineChart;
console.timeStamp("start load areachart")
var AreaChart = Charts.AreaChart;
console.timeStamp("done load AreaChart")
var MediaQuery = require('react-responsive');
var _ = require('underscore');

var axios = require('axios');
import {Link} from 'react-router'

//global variables for changing state below
var stats = [];
var dates = [];

var xScale = 'time'
var yLabel = 'age'

//setting margins as global
var margins = {
  left: 100,
  right: 100,
  top: 10,
  bottom: 60
}

var MyComponent = React.createClass({
  getInitialState: function() {
    return {
      xScale: 'time',
      yLabel: 'age?',
      data: [
        {
          "score": 0,
          "index": 0,
          avgR: 0,
          maxR: 0,
          minR: 0
        }
      ],
      chartSeries1: [
        {
          field: 'score',
          name: 'Score',
          color: '#01B6A7',
          style: {
            "strokeWidth": 2,
            "fillOpacity": .2
          }
        }
      ],
      chartSeries2: [
        {
          field: 'maxR',
          name: 'Max Reaction Time'
        }, {
          field: 'avgR',
          name: 'Average Reaction Time'
        }, {
          field: 'minR',
          name: 'Min Reaction Time'
        }
      ],
      alert: "Play some games to view your progress!",
      scoreGraph: true,
      graphWidth: window.innerWidth,
      graphHeight: window.innerHeight / 2,
      graphTime: [1, 0, 0]
    }
  },
  componentDidMount: function() {
    // Close Dropdown by clicking anywhere on document
    $(document).ready(function() {
      $('#root').on('click', function(e) {
        if (e.target != $('.dropDown p')[0]) {
          $($('.dropDown p')[0]).removeClass('dropDownExpand');
        }
        if (e.target != $('.dropDown p')[1]) {
          $($('.dropDown p')[1]).removeClass('dropDownExpand');
        }
      })
    })
    window.addEventListener('resize', this.handleResize);

    axios.get('/api/getStats', {withCredentials: true}).then(function(responseJson) {
      if (responseJson.data.success === false) {
        return
      }

      stats = responseJson.data.stats;
      this.state.data = [];
      if (stats[0]) {
        _.map(stats, function(item, index) {
          if (item.score === 0 || !item.reactionTimes[0]) {
            return
          }
          this.state.data.push(item)
          //standard date format
          this.state.data[this.state.data.length - 1].dateAchieved = new Date(item.dateAchieved)
          //indexing array (temporary)
          this.state.data[this.state.data.length - 1].index = index;
          //max reaction time
          this.state.data[this.state.data.length - 1].maxR = Math.max(...item.reactionTimes);
          //min reaction time
          this.state.data[this.state.data.length - 1].minR = Math.min(...item.reactionTimes)
          //average reaction time
          this.state.data[this.state.data.length - 1].avgR = (item.reactionTimes.reduce(function(a, b) {
            return a + b
          }) / (item.reactionTimes.length)).toFixed(2)
        }.bind(this))
      }

    }.bind(this)).then(function() {
      if (stats[0]) {
        this.setState({data: this.state.data, alert: ' '})
      }
    }.bind(this))

    //get highest n-level
    axios.get('/api/getMaxN').then(function(response) {
      var maxN = 0;
      for (var key in response.data.maxN) {
        if (response.data.maxN[key] > maxN) {
          maxN = response.data.maxN[key];
        }
      }
      this.setState({maxN: maxN})
    }.bind(this))

    //get highest score
    axios.get('/api/myHighScores').then(function(response) {
      var highScore = 0;
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].score > highScore) {
          highScore = response.data[i].score;
        }
      }
      this.setState({highScore: highScore});
    }.bind(this));

    //get user full name
    axios.get('/api/homeUserInfo').then(function(response) {
      this.setState({fullName: response.data.name})
    }.bind(this))
  },
  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },
  handleResize: function() {
    this.setState({
      graphWidth: window.innerWidth - 40,
      graphHeight: window.innerHeight / 2
    });
  },
  render: function() {
    console.log(this.state.data);

    var data = [];
    var cutoff = new Date();
    if (this.state.graphTime[0]) {
      cutoff.setDate(cutoff.getDate() - 7);
      this.state.data.map(function(score) {
        if (score.dateAchieved > cutoff) {
          data.push(score);
        }
      });
    } else if (this.state.graphTime[1]) {
      cutoff.setDate(cutoff.getDate() - 30);
      this.state.data.map(function(score) {
        if (score.dateAchieved > cutoff) {
          data.push(score);
        }
      });
    } else {
      cutoff.setDate(cutoff.getDate() - 365);
      this.state.data.map(function(score) {
        if (score.dateAchieved > cutoff) {
          data.push(score);
        }
      });
    }

    var x = function(d) {
      return d.dateAchieved;
    }
    var title = "Stack Area Chart"
    if (!stats[0]) {
      return (
        <div className="statsAlertContainer">
          <div className='statsAlert'>{this.state.alert}</div>
          <Link to='/home'><span className='fa fa-home fa-5x silent' aria-hidden='true'/></Link>
        </div>
      )
    } else {
      return (
        <div className="statsPageContainer">
          <div className="statsHeader">
            <h1>User Statistics</h1>
            <h2>({this.state.fullName})</h2>
          </div>
          <div className="statsButtonsContainer">
            <div className="dropDown">
              <p onClick={function(e) {
                $(e.target).toggleClass('dropDownExpand');
              }}>{this.state.scoreGraph
                  ? 'Score'
                  : 'Reaction Times'}</p>
              <ul onClick={function(e) {
                $(e.target.parentNode.parentNode.parentNode.children[0]).removeClass('dropDownExpand');
              }}>
                <li>
                  <a onClick={function() {
                    this.setState({scoreGraph: true});
                  }.bind(this)}>Score</a>
                </li>
                <li>
                  <a onClick={function() {
                    this.setState({scoreGraph: false});
                  }.bind(this)}>Reaction Times</a>
                </li>
              </ul>
            </div>
            <div className="dropDown">
              <p onClick={function(e) {
                $(e.target).toggleClass('dropDownExpand');
              }}>{this.state.graphTime[0]
                  ? 'Last Week'
                  : (this.state.graphTime[1]
                    ? 'Last Month'
                    : 'Last Year')}</p>
              <ul onClick={function(e) {
                $(e.target.parentNode.parentNode.parentNode.children[0]).removeClass('dropDownExpand');
              }}>
                <li>
                  <a onClick={function() {
                    this.setState({
                      graphTime: [1, 0, 0]
                    });
                  }.bind(this)}>Last Week</a>
                </li>
                <li>
                  <a onClick={function() {
                    this.setState({
                      graphTime: [0, 1, 0]
                    });
                  }.bind(this)}>Last Month</a>
                </li>
                <li>
                  <a onClick={function() {
                    this.setState({
                      graphTime: [0, 0, 1]
                    });
                  }.bind(this)}>Last Year</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="chartsContainer">
            {this.state.scoreGraph
              ? <LineChart className='StatsScoreGraph' data={data} margins={margins} chartSeries={this.state.chartSeries1} width={this.state.graphWidth} height={this.state.graphHeight} title={'Score History'} x={x} xScale={xScale} yAxisClassName={'lineY'} xAxisClassName={'lineX'} yLabel={'Scores'} //x axis includes first and last day of play (for time range)
  xLabel={'Gameplay from ' + cutoff.toDateString() + ' to ' + new Date().toDateString()}/>
              : <AreaChart width={this.state.graphWidth} height={this.state.graphHeight} title='TITLE' data={data} className='StatsReactionGraph' margins={margins} chartSeries={this.state.chartSeries2} yAxisClassName={'areaY'} xAxisClassName={'areaX'} x={x} xScale={xScale} yLabel={'Reaction Times (ms)'} //x axis includes first and last day of play (for time range)
  xLabel={'Gameplay from ' + cutoff.toDateString() + ' to ' + new Date().toDateString()}/>}
          </div>
          <div className="statsDetailsContainer">
            <table>
              <tbody>
                <tr>
                  <td style={{
                    'width': '60%'
                  }}>Games Played:
                  </td>
                  <td className="statsTableData">{this.state.data.length}</td>
                </tr>
                <tr>
                  <td>N-Level Reached:
                  </td>
                  <td className="statsTableData">{this.state.maxN}</td>
                </tr>
                <tr>
                  <td>Highest Score:
                  </td>
                  <td className="statsTableData">{this.state.highScore}</td>
                </tr>
              </tbody>
            </table>

            <Link className="leaderLink" to="/leaderboard">
              <span className="lbChart">
                <span className="fa fa-signal fa-5x"></span>
                <h2>leaderboard</h2>
              </span>
            </Link>
          </div>
        </div>
      );
    }
  }
});

var pressedStyle = {
  backgroundColor: '#01b6a7',
  color: 'white'
}

module.exports = MyComponent
