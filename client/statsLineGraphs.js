var React = require('react');
var ReactDOM = require('react-dom');
//var d3=require('d3'); //some documentation hass this in examples, so keep to be safe
console.timeStamp("start load lineChart")
// var LineChart = require('react-d3-basic').LineChart;

// console.timeStamp("start load AreaChart")

// var AreaChart = require('react-d3-basic').AreaChart;

import {AreaChart , LineChart} from 'react-easy-chart'

var axios=require('axios');
import { Link } from 'react-router'


//global variables for changing state below
var stats=[];

//setting margins as global
var margins = {left: 100, right: 100, top: 10, bottom: 60}

var MyComponent = React.createClass({
  getInitialState: function(){
    return{
      xScale:'time',
      yLabel:'age?',
      dayA:'',
      monthA:'',
      dateA:'',
      yearA:'',
      dayB:'',
      monthB:'',
      dateB:'',
      yearB:'',
      data: [{"score": 0, "index": 0, avgR:0, maxR:0, minR:0}],
      chartSeries1: [{field: 'score', name: 'Score', color: '#ff7f0e',
            style: {"strokeWidth": 2, "fillOpacity": .2}}],
      chartSeries2: [{field: 'maxR', name: 'Max Reaction Time'},
                      {field: 'avgR', name: 'Average Reaction Time'},
                      {field: 'minR', name: 'Min Reaction Time'}],
      alert: "Play some games to view your progress!",
      stats:null
    }
  },
  componentDidMount: function(){
    axios.get('/getStats', {withCredentials: true})
    .then(function(response){
      console.log(stats, response.data.stats)
      stats = response.data.stats
      if(response.data.stats.length>0){
        this.setState({
          data:[],
          stats:response.data.stats
        });
      }
      else{
        this.setState({stats:null, data:null});
      }

      console.log(this.state.stats,'stats',this.state.data, 'data')
      
      this.state.stats.forEach(function(item, index){
        console.log("forEACHHHHHHHHHHHHHHHHHHHHhh")
        if(!item.reactionTimes[0]){
          return;
        }
        console.log(item)
        var obj = {};
        //standard date format
        obj.dateAchieved=new Date(item.dateAchieved)
        //indexing array (temporary)
        obj.index=index;
        //max reaction time
        obj.maxR=Math.max(...item.reactionTimes);
        //min reaction time
        obj.minR=Math.min(...item.reactionTimes)
        //average reaction time
        obj.avgR=(item.reactionTimes.reduce(function(a,b){
          return a+b
        })/(item.reactionTimes.length)).toFixed(2)
        console.log("obj", obj)
        var arr = this.state.data;
        console.log(arr)
        arr.push(obj);
        console.log(arr);
        this.setState({data:arr})
        console.log(arr,this.state.data)

        console.log(this.state.stats,'stats')
        console.log(this.state.data,'data')
      }.bind(this))
      
    console.log(this.state.data)
     //pull first and last data objects and parse for axes

    }.bind(this))
    .then(function(){
      //this.setState({data:arr})
      console.log("then")
      if(this.state.stats.length>0){
        this.setState({
          data: this.state.data,
          alert: ' ',
          dayA: this.state.data[0].dateAchieved.toDateString(),
          // monthA:this.state.data[0].dateAchieved.getMonth(),
          // dateA:this.state.data[0].dateAchieved.getDate(),
          // yearA:this.state.data[0].dateAchieved.getFullYear(),
          dayB : this.state.data[this.state.data.length-1].dateAchieved.toDateString()
          // monthB:this.state.data[this.state.data.length-1].dateAchieved.getMonth(),
          // dateB:this.state.data[this.state.data.length-1].dateAchieved.getDate(),
          // yearB:this.state.data[this.state.data.length-1].dateAchieved.getFullYear()
     
        })
      }
      
    }.bind(this))
  },
  render: function() {
    console.log(this.state)
    var x = function(d) {
      console.log(d)
      return d.dateAchieved.getTime();
    }
    var title = "Stack Area Chart"
    if(!this.state.stats || this.state.stats.length<1){
      console.log("option 1")
      return(
        <div className="statsAlertContainer">
          <div className='statsAlert'>{this.state.alert}</div>
          <Link to='/home'><span className='fa fa-home fa-5x relaxed' aria-hidden='true'/></Link>
        </div>
      )
    }
    else{
      console.log("option 2")
      console.log(this.state.dayA)
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
        xScale={this.state.xScale}
        yAxisClassName= {'lineY'}
        xAxisClassName= {'lineX'}
        yLabel={'Scores'}
        //x axis includes first and last day of play (for time range)
        //xLabel={'Gameplay from '+this.state.dayA+', '+ this.state.monthA + ' '+ this.state.dateA+ ', ' +this.state.yearA + ' to ' +this.state.dayB+', '+ this.state.monthB + ' '+ this.state.dateB+ ', ' +this.state.yearB}
        xLabel={'Gameplay from '+this.state.dayA+' to '+this.state.dayB}
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
        xScale={this.state.xScale}
        yLabel={'Reaction Times (ms)'}
        //x axis includes first and last day of play (for time range)
        //xLabel={'Gameplay from '+this.state.dayA+', '+ this.state.monthA + ' '+ this.state.dateA+ ', ' +this.state.yearA + ' to ' +this.state.dayB+', '+ this.state.monthB + ' '+ this.state.dateB+ ', ' +this.state.yearB}
        xLabel={'Gameplay from '+this.state.dayA+' to '+this.state.dayB}
      />
     </div>)

    }
   
  }
});

module.exports = MyComponent
