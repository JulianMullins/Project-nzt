// first of course react!
var React = require('react');
// require `react-d3-core` for Chart component, which help us build a blank svg and chart title.
var Chart = require('react-d3-core').Chart;
// require `react-d3-basic` for Line chart component.
var LineChart = require('react-d3-basic').LineChart;

//get funciton, res.json()
// //use req.user
// var chartData = {labels: ["January", "February", "March", "April", "May", "June", "July"],
//     datasets: [
//         {
//             score: 123      
//         },
//          {
//             score: 145
//         },
//         {
//             score: 125
//         },
//         {
//             score: 245
//         },
//         {
//             score: 341
//         }
//     ]};

// var width = 700,
//     height = 300,
//     margins = {left: 100, right: 100, top: 50, bottom: 50},
//     title = "User sample",
//     // chart series,
//     // field: is what field your data want to be selected
//     // name: the name of the field that display in legend
//     // color: what color is the line
//     chartSeries = [
//       {
//         field: 'BMI',
//         name: 'BMI',
//         color: '#ff7f0e'
//       }
//     ],
//     // your x accessor
//     x = function(d) {
//       return d.index;
//     }

var MyComponent = React.createClass({
    componentDidMount: function(){
//fetch call

fetch('/taco', {method: 'GET'})
.then(function(response){
    console.log(response, '38')
    return response.json()
    })
.then(function(responseJson){
    console.log(responseJson,'41')
})
    },
  render: function() {
    return <div>TEST</div>
    // return <Chart
    //   title={title}
    //   width={width}
    //   height={height}
    //   margins= {margins}
    //   >
    //   <LineChart
    //     margins= {margins}
    //     title={title}
    //     data={chartData}
    //     width={width}
    //     height={height}
    //    // chartSeries={chartSeries}
    //     x={x}
    //   />
   // </Chart>
  }
});

module.exports = MyComponent