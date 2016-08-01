var React = require('react');
var ReactDOM = require('react-dom');
var d3=require('d3');
//var rd3 = require('react-d3-basic');
var LineChart = require('react-d3-basic').LineChart;
//var Chart = require('react-d3-core').Chart;
var AreaChart = require('react-d3-basic').AreaChart;
var _=require('underscore');
var axios=require('axios');

var stats;
var dates=[];

var xScale='time'
var yLabel='age'
//var parseDate = d3.time.format("%YM%m").parse;

var margins = {left: 100, right: 100, top: 50, bottom: 50}
var MyComponent = React.createClass({
  getInitialState: function(){
    return{
      data: [{"score": 0, "index": 0, avgR:0, maxR:0, minR:0}],
      chartSeries1: [{field: 'score', name: 'Score', color: '#ff7f0e',
            style: {"strokeWidth": 2, "fillOpacity": .2}}],
      chartSeries2: [{field: 'maxR', name: 'Max Reaction Time'},
                      {field: 'avgR', name: 'Average Reaction Time'},
                      {field: 'minR', name: 'Min Reaction Time'}]
                    }
    },
componentDidMount: function(){
 //console.log(this.state, 'state')
axios.get('/taco', {withCredentials: true})
.then(function(responseJson){
    stats=responseJson.data.stats;
    console.log(stats, 'stats')
    this.state.data=[];
   _.map(stats, function(item, index){
      if(item.score===0 || !item.reactionTimes[0]){
        return
       }
      this.state.data.push(item)
      //standard date format
      this.state.data[this.state.data.length-1].dateAchieved=new Date(item.dateAchieved)
      //indexing array (temporary)
      this.state.data[this.state.data.length-1].index=index;
      //max reaction time
      this.state.data[this.state.data.length-1].maxR=Math.max(...item.reactionTimes);
      //min reaction time
      this.state.data[this.state.data.length-1].minR=Math.min(...item.reactionTimes)
      //average reaction time
      this.state.data[this.state.data.length-1].avgR=(item.reactionTimes.reduce(function(a,b){
        return a+b
      })/(item.reactionTimes.length)).toFixed(2)
   }.bind(this))
   console.log(this.state.data,'new state')
   // console.log(dates,'dates')
   // console.log(this.state.lineData2[2].values)
  }.bind(this))
  .then(function(){
    this.setState({
      data: this.state.data
    })
}.bind(this))
},
  render: function() {
    var x = function(d) {
      return d.dateAchieved;
    }
   return (<div> <LineChart
        className='topStatsGraph'
        data={this.state.data}
        margins={margins}
        chartSeries={this.state.chartSeries1}
        width={1100}
        height={400}
        x={x}
        xScale={xScale}
        yLabel={'Scores'}
        xLabel={'Gameplay from A to B'}
        />
    <AreaChart
      data= {this.state.data}
      width= {1100}
      height= {400}
      chartSeries= {this.state.chartSeries2}
      x= {x}
      xScale={xScale}
      yLabel={'Reaction Times (ms)'}
      xLabel={'Gameplay from A to B'}
    />
   </div>)
  }
});

<<<<<<< HEAD

//  //        <AreaChart
//  //        className='bottomStatsGraph'
//  //        data={this.state.lineData2}
//  //        width={1100}
//  //        height={400}
//  //        title="Reaction Time Trends"
//  //        yAxisLabel="Altitude"
//  //        xAxisLabel="Elapsed Time (sec)"
//  //        />
=======
module.exports = MyComponent
>>>>>>> refs/remotes/origin/master
