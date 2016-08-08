var React = require('react');
var ReactDOM = require('react-dom');
//var d3=require('d3'); //some documentation hass this in examples, so keep to be safe
console.timeStamp("start load lineChart")
var LineChart = require('react-d3-basic').LineChart;

console.timeStamp("start load AreaChart")

var AreaChart = require('react-d3-basic').AreaChart;

console.timeStamp("start load underscore")
var _=require('underscore');
var axios=require('axios');
import { Link } from 'react-router'


//global variables for changing state below
var stats=[];
var dates=[];

var xScale='time'
var yLabel='age'
//these are just variables to parse and add the first and last game dates to the x axes
var dayA =' '
var monthA =' '
var dateA =' '
var yearA =' '
var dayB =' '
var monthB =' '
var dateB =' '
var yearB =' '

//setting margins as global
var margins = {left: 100, right: 100, top: 10, bottom: 60}

var MyComponent = React.createClass({
  getInitialState: function(){
    return{
      data: [{"score": 0, "index": 0, avgR:0, maxR:0, minR:0}],
      chartSeries1: [{field: 'score', name: 'Score', color: '#ff7f0e',
            style: {"strokeWidth": 2, "fillOpacity": .2}}],
      chartSeries2: [{field: 'maxR', name: 'Max Reaction Time'},
                      {field: 'avgR', name: 'Average Reaction Time'},
                      {field: 'minR', name: 'Min Reaction Time'}],
      alert: "Play some games to view your progress!"
                    }
    },
componentDidMount: function(){
axios.get('/getStats', {withCredentials: true})
.then(function(responseJson){
    stats=responseJson.data.stats;
    console.log(stats)
    this.state.data=[];
    console.log(stats,'stats')
    if(stats[0]){
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
    }
   
  
   //pull first and last data objects and parse for axes
   if(stats[0]){
    dayA = this.state.data[0].dateAchieved.toString().split(' ')[0]
   monthA=this.state.data[0].dateAchieved.toString().split(' ')[1]
   dateA=this.state.data[0].dateAchieved.toString().split(' ')[2]
   yearA=this.state.data[0].dateAchieved.toString().split(' ')[3]
   dayB = this.state.data[this.state.data.length-1].dateAchieved.toString().split(' ')[0]
   monthB=this.state.data[this.state.data.length-1].dateAchieved.toString().split(' ')[1]
   dateB=this.state.data[this.state.data.length-1].dateAchieved.toString().split(' ')[2]
   yearB=this.state.data[this.state.data.length-1].dateAchieved.toString().split(' ')[3]
   }
   
  }.bind(this))
  .then(function(){
    if(stats[0]){
      this.setState({
      data: this.state.data,
      alert: ' '
    })
    }
    
}.bind(this))
},
  render: function() {
    console.log(stats,'stats')
    var x = function(d) {
      return d.dateAchieved;
    }
    var title = "Stack Area Chart"
    if(!stats[0]){
      return(
        <div className="statsAlertContainer">
          <div className='statsAlert'>{this.state.alert}</div>
          <Link to='/home'><span className='fa fa-home fa-5x relaxed' aria-hidden='true'/></Link>
        </div>
      )
    }
    else{
      return (<div>
       <LineChart
        className='StatsScoreGraph'
        data={this.state.data}
        margins={margins}
        chartSeries={this.state.chartSeries1}
        width={1100}
        height={500}
        title={'Score History'}
        x={x}
        xScale={xScale}
        yAxisClassName= {'lineY'}
        xAxisClassName= {'lineX'}
        yLabel={'Scores'}
        //x axis includes first and last day of play (for time range)
        xLabel={'Gameplay from '+dayA+', '+ monthA + ' '+ dateA+ ', ' +yearA + ' to ' +dayB+', '+ monthB + ' '+ dateB+ ', ' +yearB}
        />
    <AreaChart
      width={1100}
      height={500}
      title='TITLE'
      data= {this.state.data}
      className='StatsReactionGraph'
      margins={margins}
      chartSeries= {this.state.chartSeries2}
      yAxisClassName= {'areaY'}
      xAxisClassName= {'areaX'}
      x= {x}
      xScale={xScale}
      yLabel={'Reaction Times (ms)'}
      //x axis includes first and last day of play (for time range)
      xLabel={'Gameplay from '+dayA+', '+ monthA + ' '+ dateA+ ', ' +yearA + ' to ' +dayB+', '+ monthB + ' '+ dateB+ ', ' +yearB}
    />
   </div>)
    }
   
  }
});

module.exports = MyComponent
