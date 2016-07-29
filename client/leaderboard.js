var React = require('react');
var Reactable = require('reactable');
var Table = Reactable.Table;
var axios = require('axios');

var Leaderboard = React.createClass({
  getInitialState: function() {
    return {allScores: [], myScores: [], global: true}
  },
  componentDidMount: function() {
    this.getAllScores();
    this.getMyScores();
  },
  getAllScores: function() {
    axios.get('/allHighScores').then(function(response) {
      console.log('all scores', response.data);
      this.setState({allScores: response.data});
    }.bind(this));
  },
  getMyScores: function() {
    axios.get('/myHighScores').then(function(response) {
      console.log('my scores', response.data);
      this.setState({myScores: response.data});
    }.bind(this));
  },
  render: function() {
    return (
      <div className="leaderboardPage">
        <div className="boardSide">
          <h1 className="lbHeader">Leaderboards</h1>
          <section>
            <div className="leaderboardButtons">
              <a onClick={function() {
                this.setState({global: true})
              }.bind(this)} style={this.state.global
                ? selectedStyle
                : {}}>Global</a>
              <a onClick={function() {
                this.setState({global: false})
              }.bind(this)} style={!this.state.global
                ? selectedStyle
                : {}}>Personal</a>
            </div>
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
            ]} data={this.state.global
              ? this.state.allScores
              : this.state.myScores} currentPage={0} itemsPerPage={10} pageButtonLimit={5} sortable={true} defaultSort={{
              column: 'score',
              direction: 'desc'
            }} filterable={['mode', 'username']}/>
          </section>
        </div>
      </div>
    )
  }
});

var selectedStyle = {
  backgroundColor: 'white',
  color: '#f1ba03'
}

module.exports = Leaderboard
