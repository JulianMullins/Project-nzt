var React = require('react');
var Chart = require('chart.js')
var LineChart = require("react-chartjs").Line;


var LineChart = require("react-chartjs").Line;

var MyComponent = React.createClass({
  render: function() {
    return <LineChart data={chartData} options={chartOptions} width="600" height="250"/>
  }
});

module.exports = MyComponent