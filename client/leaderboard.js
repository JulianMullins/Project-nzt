var React = require('react');
var Reactable = require('reactable');
var Table = Reactable.Table;
var axios = require('axios');

var Leaderboard = React.createClass({
  componentDidMount: function() {
    this.getAllScores();
  },
  getAllScores: function() {
    axios.get('/allHighScores')
    .then(function(response) {
      this.setState({
        allScores: response.data
      });
    }.bind(this));
    console.log('ran');
  },
  myScores: function() {
    axios.get('/myHighScores')
    .then(function(response) {
      this.setState({
        myScores: response.data
      });
    }.bind(this));
  },
  render: function() {
    var data = [
      {
        mode: 'Advanced',
        username: 'Adam',
        score: 2000,
        level: 16
      }, {
        mode: 'Classic',
        username: 'Taylor',
        score: 1980,
        level: 19
      }, {
        mode: 'Advanced',
        username: 'Julian',
        score: 1760,
        level: 6
      }, {
        mode: 'Relaxed',
        username: 'Ruth',
        score: 1580,
        level: 19
      }, {
        mode: 'Silent',
        username: 'Virginia',
        score: 70,
        level: 2
      }
    ];
    return (
      <div className="leaderboardPage">
        <div className="boardSide">
          <h1 className="lbHeader">Leaderboards</h1>
          <section>
            <Table columns={[
              {
                key: 'username',
                label: 'Username'
              }, {
                key: 'mode',
                label: 'Mode'
              }, {
                key: 'score',
                label: 'Score'
              }, {
                key: 'level',
                label: 'Level'
              }
            ]} data={data} itemsPerPage={10} pageButtonLimit={5} sortable={true} filterable={['mode', 'username']}/>
          </section>
        </div>
      </div>
    )
  }
});

module.exports = Leaderboard
