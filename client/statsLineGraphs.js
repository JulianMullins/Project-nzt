var React = require('react');
var ReactDOM = require('react-dom');
var rd3 = require('react-d3');
var LineChart = rd3.LineChart;
var AreaChart = rd3.AreaChart;
var axios = require('axios')
var _=require('underscore')
var stats;
var dates=[];
// var lineData1 = [{name: 'scores', values:[]}];
// var lineData2 = [{name: 'reaction times', values:[]}];
var Legend = require('react-d3-core').Legend;

  // setting you svg width
  var width = 500
    // setting your svg height
  var height = 100
    // setting your margins of your svg
  var margins = {top: 20, right: 50, bottom: 20, left: 50}
    // your x Axis accessor
  // var x = function(d) {
  //     return parseDate(d.month);
  //   },
    // set your x domain
  //var xDomain = d3.extent(chartData, function(d){ return x(d) }),
    // set your x range
    var xDomain=[0,1]
    var xRange = [0, 10]
    // your scale type 'linear', 'ordinal', 'time'... etc.
    var xScale = 'time'
    // set your label name
    var xLabel = "Month";


var MyComponent = React.createClass({
  getInitialState: function(){
    return{
      lineData1: [{name: 'scores', values:[{x:0,y:0}]}],
      lineData2: [{name: 'max reaction time', values:[{x:0,y:0}]},{name: 'avg reaction time', values:[{x:0,y:0}]},{name: 'min reaction time', values:[{x:0,y:0}]}]
    }
  },
componentDidMount: function(){
 // console.log(this.state, 'state')
axios.get('/taco', {withCredentials: true})
.then(function(responseJson){
    this.state.lineData1[0].values=[];
    this.state.lineData2[0].values=[];
    this.state.lineData2[1].values=[];
    this.state.lineData2[2].values=[];
    stats=responseJson.data.stats;
    _.map(stats, function(item, index){
      if(item.score===0 || item.reactionTimes[0]===0){
        return
      }
      this.state.lineData1[0].values.push({x: index, y:item.score})
      this.state.lineData2[0].values.push({x: index, y:item.reactionTimes[0]*1.2/1000})
      this.state.lineData2[1].values.push({x: index, y:item.reactionTimes[0]/1000})
      this.state.lineData2[2].values.push({x: index, y:(item.reactionTimes[0]*.8/1000)})
      var date=item.dateAchieved.split('Z');
      date=date[0].split('T');
      date=date[0].split('-')
      dates.push({full: item.dateAchieved, splitDate: date})
    }.bind(this))
   // console.log(dates,'dates')
   // console.log(this.state.lineData2[2].values)
  }.bind(this))
  .then(function(){
    this.setState({
      lineData1: this.state.lineData1,
      lineData2: this.state.lineData2
    })
}.bind(this))
},
  render: function() {
   return ( <div><Legend
      width= {width}
      height= {height}
      margins= {margins}
      legendClassName= {legendClassName}
      legendPosition= {legendPosition}
      legendOffset= {legendOffset}
      chartSeries = {chartSeries}
    /></div>)
  }
});

module.exports = MyComponent

 // <LineChart
 //        className='topStatsGraph'
 //        data={this.state.lineData1}
 //        width={1100}
 //        height={400}
 //        title="Score Trends"
 //        yAxisLabel="Altitude"
 //        xAxisLabel="Elapsed Time (sec)"

 //        />
 //        <AreaChart
 //        className='bottomStatsGraph'
 //        data={this.state.lineData2}
 //        width={1100}
 //        height={400}
 //        title="Reaction Time Trends"
 //        yAxisLabel="Altitude"
 //        xAxisLabel="Elapsed Time (sec)"
 //        />