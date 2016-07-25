var React = require('react');
var Reactable = require('reactable');
var Table = Reactable.Table;

var Stats = React.createClass({
  render: function() {
    var data = [
      {
        mode: 'Advanced',
        score: 2000,
        level: 16
      }, {
        mode: 'Classic',
        score: 1980,
        level: 19
      }, {
        mode: 'Advanced',
        score: 1760,
        level: 6
      }, {
        mode: 'Relaxed',
        score: 1580,
        level: 19
      }, {
        mode: 'Silent',
        score: 70,
        level: 2
      }
    ];
    return (
      <div className="leaderboardPage">
        <div className="userSide">
          <h1 className="lbHeader">Statistics</h1>
          <section>
            <Table columns={[
              {
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

module.exports = Stats
