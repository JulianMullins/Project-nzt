var React = require('react');
var axios = require('axios');

var goodJob = function(){
	currentScore = ((2000 - reactionTimes[reactionTimes.length - 1]) / 100).toFixed(2);
    fullScore += parseFloat(currentScore);
    matchCount += 1;
    matchHit += 1;
    this.setState({
      alert: "Good job",
      score: this.state.score + parseInt(currentScore),
      posStle: noStyle
    });
}

