// var React = require('react');
// var ReactDOM = require('react-dom');
// var rd3 = require('react-d3-basic');
// var LineChart = rd3.LineChart;
// var AreaStackChart = rd3.AreaStackChart;
// var _=require('underscore')
// var axios=require('axios')
// var stats;
// var dates=[];


// var margins = {left: 100, right: 100, top: 50, bottom: 50}
// var MyComponent = React.createClass({
//   getInitialState: function(){
//     return{
//       data: [{"score": 0, "index": 0, avgR:0, maxR:0, minR:0}],
//       chartSeries1: [{field: 'score', name: 'Score', color: '#ff7f0e',
//             style: {"strokeWidth": 2, "fillOpacity": .2}}]
//           },
//       chartSeries2: [{field: 'avgR', name: 'Average Reaction Time', color: '#ff7f0e',
//             style: {"strokeWidth": 2, "fillOpacity": .2}},
//             {field: 'maxR', name: 'Max Reaction Time', color: '#ff7f0e',
//             style: {"strokeWidth": 2, "fillOpacity": .2}},
//             {field: 'minR', name: 'Min Reaction Time', color: '#ff7f0e',
//             style: {"strokeWidth": 2, "fillOpacity": .2}}]
//           },
//     },
// componentDidMount: function(){
//  console.log(this.state, 'state')
// axios.get('/taco', {withCredentials: true})
// .then(function(responseJson){
//     stats=responseJson.data.stats;
//     //console.log(stats, 'stats')
//     this.state.data=[];
//    _.map(stats, function(item, index){
//       if(item.score===0 || !item.reactionTimes[0]){
//         return
//        }
//       this.state.data.push(item)
//       this.state.data[this.state.data.length-1].index=index;
//    }.bind(this))
//    //console.log(this.state.data,'new state')
//    // console.log(dates,'dates')
//    // console.log(this.state.lineData2[2].values)
//   }.bind(this))
//   .then(function(){
//     this.setState({
//       data: this.state.data
//     })
// }.bind(this))
// },
//   render: function() {
//     var x = function(d) {
//       return d.index;
//     }
//    return ( <div> <LineChart
//         className='topStatsGraph'
//         data={this.state.data}
//         margins={margins}
//         chartSeries={this.state.chartSeries1}
//         width={1100}
//         height={400}
//         x={x}
//         />
//         <AreaStackChart
//         className='topStatsGraph'
//         data={this.state.data}
//         margins={margins}
//         chartSeries={this.state.chartSeries2}
//         width={1100}
//         height={400}
//         x={x}
//         /></div>)
//   }
// });

// module.exports = MyComponent





//  //        <AreaChart
//  //        className='bottomStatsGraph'
//  //        data={this.state.lineData2}
//  //        width={1100}
//  //        height={400}
//  //        title="Reaction Time Trends"
//  //        yAxisLabel="Altitude"
//  //        xAxisLabel="Elapsed Time (sec)"
//  //        />
