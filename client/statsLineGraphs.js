var React = require('react');
var ReactDOM = require('react-dom');
var rd3 = require('react-d3-basic');
var LineChart = rd3.LineChart;
var AreaChart = rd3.AreaChart;
var _=require('underscore')
var axios=require('axios')
var stats;
var dates=[];
// var lineData1 = [{name: 'scores', values:[]}];
// var lineData2 = [{name: 'reaction times', values:[]}];
//var Legend = require('react-d3-core').Legend;

      var data = [
          {
              "age": 0,
              "index": 0
          },
          {
              "age": .2,
              "index": 1
          },
          {
              "age": .7,
              "index": 2
          },
          {
              "age": .4,
              "index": 3
          }
      ];
 
      var chartSeries = [
          {
            field: 'age',
            name: 'Age',
            color: '#ff7f0e',
            style: {
              "stroke-width": 2,
              "stroke-opacity": .2,
              "fill-opacity": .2
            }
          }
        ]
 var x = function(d) {
      return d.index;
    }

var MyComponent = React.createClass({
  getInitialState: function(){
    return{
      lineData1: [{name: 'scores', values:[{x:0,y:0}]}],
      lineData2: [{name: 'max reaction time', values:[{x:0,y:0}]},{name: 'avg reaction time', values:[{x:0,y:0}]},{name: 'min reaction time', values:[{x:0,y:0}]}]
    }
  },
componentDidMount: function(){
 // console.log(this.state, 'state')
// axios.get('/taco', {withCredentials: true})
// .then(function(responseJson){
//     this.state.lineData1[0].values=[];
//     this.state.lineData2[0].values=[];
//     this.state.lineData2[1].values=[];
//     this.state.lineData2[2].values=[];
//     stats=responseJson.data.stats;
//     _.map(stats, function(item, index){
//       if(item.score===0 || item.reactionTimes[0]===0){
//         return
//       }
//       this.state.lineData1[0].values.push({x: index, y:item.score})
//       this.state.lineData2[0].values.push({x: index, y:item.reactionTimes[0]*1.2/1000})
//       this.state.lineData2[1].values.push({x: index, y:item.reactionTimes[0]/1000})
//       this.state.lineData2[2].values.push({x: index, y:(item.reactionTimes[0]*.8/1000)})
//       var date=item.dateAchieved.split('Z');
//       date=date[0].split('T');
//       date=date[0].split('-')
//       dates.push({full: item.dateAchieved, splitDate: date})
//     }.bind(this))
//    // console.log(dates,'dates')
//    // console.log(this.state.lineData2[2].values)
//   }.bind(this))
//   .then(function(){
//     this.setState({
//       lineData1: this.state.lineData1,
//       lineData2: this.state.lineData2
//     })
// }.bind(this))
},
  render: function() {
   return ( <div> <LineChart
        className='topStatsGraph'
        data={data}
        chartSeries={chartSeries}
        width={1100}
        height={400}
        x={x}
        /></div>)
  }
});

module.exports = MyComponent


// <Legend
//       width= {width}
//       height= {height}
//       margins= {margins}
//       legendClassName= {legendClassName}
//       legendPosition= {legendPosition}
//       legendOffset= {legendOffset}
//       chartSeries = {chartSeries}
//     />


 //        <AreaChart
 //        className='bottomStatsGraph'
 //        data={this.state.lineData2}
 //        width={1100}
 //        height={400}
 //        title="Reaction Time Trends"
 //        yAxisLabel="Altitude"
 //        xAxisLabel="Elapsed Time (sec)"
 //        />