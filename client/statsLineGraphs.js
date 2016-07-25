var React = require('react');
var Chart = require('chart.js')
var LineChart = require("react-chartjs").Line;
//get funciton, res.json()
//use req.user
var data = {labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
        },
         {
            data: [75, 59, 90, 21, 56, 35, 90]
        }
    ]};

var options= scales: {
            yAxes: [{
                stacked: true
            }]
        };

var MyComponent = React.createClass({
    componentDidMount: function(){
//fetch call

fetch('/getstats', {method: 'GET'})
.then(function(response){
    console.log(response, '38')
    })
.then(function(responseJson){
    console.log(responseJson,'41')
})
    },
  render: function() {
    return <LineChart data={data} options={options} width="600" height="250"/>
  }
});

module.exports = MyComponent