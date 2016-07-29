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

var MyComponent = React.createClass({
  getInitialState: function(){
    return{
      lineData1: [{name: 'scores', values:[{x:0,y:0}]}],
      lineData2: [{name: 'reaction times', values:[{x:0,y:0}]}]
    }
  },
componentDidMount: function(){
 // console.log(this.state, 'state')
axios.get('/taco', {withCredentials: true})
.then(function(responseJson){
  //console.log(this.state,'state')
    // //console.log(responseJson.data,'41')
    this.state.lineData1[0].values=[];
    this.state.lineData2[0].values=[];
    stats=responseJson.data.stats;
    // //console.log(stats,'stats')
    _.map(stats, function(item, index){
      if(item.score===0 || item.reactionTimes[0]===0){
        return
      }
      this.state.lineData1[0].values.push({x: index, y:item.score})
      this.state.lineData2[0].values.push({x: index, y:item.reactionTimes[0] || 0})
      dates.push(item.dateAchieved)
    }.bind(this))
    //console.log(this,'this')
  }.bind(this))
  .then(function(){
    console.log(this.state,'this.state')
    this.setState({
      lineData1: this.state.lineData1,
      lineData2: this.state.lineData2
    })
}.bind(this))
},
  render: function() {
   return (<div><LineChart
        data={this.state.lineData1}
        width={500}
        height={300}
        title="Line Chart"
        />
        <AreaChart
        data={this.state.lineData2}
        width={500}
        height={300}
        title="Area Chart"
        /></div>)
  }
});
      
module.exports = MyComponent