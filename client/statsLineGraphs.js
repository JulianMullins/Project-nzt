var React = require('react');
var ReactDOM = require('react-dom');
var rd3 = require('react-d3');
var LineChart = rd3.LineChart;




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
//         field: 'score',
//         name: 'score',
//         color: '#ff7f0e'
//       }
//     ],
//     // your x accessor
//     x = function(d) {
//       return d.index;
//     }

    //console.log(x)

var MyComponent = React.createClass({
    componentDidMount: function(){
//fetch call

// fetch('/taco', {method: 'GET'})
// .then(function(response){
//     console.log(response, '38')
//     return response.json()
//     })
// .then(function(responseJson){
//     console.log(responseJson,'41')
// })
    },
  render: function() {
    var lineData = [
  {
    name: "series1",
    values: [ { x: 0, y: 20 }, { x: 24, y: 10 } ]
  },
  {
    name: "series2",
    values: [ { x: 70, y: 82 },  { x: 76, y: 82 } ]
  }
]; //return <div>TEST</div>
    return 
(
<LineChart
        legend={true}
        data={lineData}
        width={500}
        height={300}
        title="Line Chart"
        />)
  }
});
      
module.exports = MyComponent