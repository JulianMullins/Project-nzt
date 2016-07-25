var React = require('react');
<<<<<<< HEAD
var Chart = require('chart.js')
var LineChart = require("react-chartjs").Line;
//get funciton, res.json()
//use req.user
var data = {labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
        }
    ]}

// fetch('/taylorsStats',{method:'get'
//     }).then(function(response) {
//       console.log(response);
//         return response.json();
//       }).then(function(response) {
//         console.log(response);
//         if (response.success) {
//           console.log('this works')
//         }
//      })


var MyComponent = React.createClass({
    componentDidMount: function(){
//fetch call
    },
  render: function() {
    return <LineChart data={data} width="600" height="250"/>
  }
});

module.exports = MyComponent
=======
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
>>>>>>> refs/remotes/origin/master
