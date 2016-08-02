var React = require('react');
var Reactable = require('reactable');
var Table = Reactable.Table;
var axios = require('axios');
import {Link} from 'react-router';

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
      this.setState({allScores: response.data});
    }.bind(this));
  },
  getMyScores: function() {
    axios.get('/myHighScores').then(function(response) {
      this.setState({myScores: response.data});
    }.bind(this));
  },
  render: function() {
    var table = this.state.global
      ? <Table columns={[
          {
            key: 'rank',
            label: 'rank'
          }, {
            key: 'username',
            label: 'Username'
          }, {
            key: 'score',
            label: 'score'
          }, {
            key: 'mode',
            label: 'mode'
          }, {
            key: 'level',
            label: 'Level'
          }
        ]} data={this.state.allScores} currentPage={0} itemsPerPage={10} pageButtonLimit={5} sortable={true} defaultSort={{
          column: 'rank',
          direction: 'asc'
        }} filterable={['username']}/>
      : <Table style={{
        paddingTop: '6vh'
      }} columns={[
        {
          key: 'score',
          label: 'score'
        }, {
          key: 'mode',
          label: 'mode'
        }, {
          key: 'level',
          label: 'Level'
        }
      ]} data={this.state.myScores} currentPage={0} itemsPerPage={10} pageButtonLimit={5} sortable={true} defaultSort={{
        column: 'score',
        direction: 'desc'
      }}/>;

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
            {table}
          </section>
        </div>
        <Link to="/home"><img className="whiteLogo" src="./images/CortexLogo3.png"/></Link>
      </div>
    )
  }
});

var selectedStyle = {
  backgroundColor: '#01b6a7',
  color: 'white'
}

module.exports = Leaderboard
