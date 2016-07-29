var React = require('react');
var axios = require('axios');


var startGameFunction = function(mode,N,callback){
	console.log("startGameFunction")
	axios.post('/startGame/' + mode + '/' + N)
	.then(function(response) {
      console.log("start game posted", response)
      return callback({
        tempUser: response.data.tempUser,
        gameId: response.data.gameId,
        modeMultiplier: response.data.modeMultiplier,
        penalty: response.data.penalty,
        positivePoints: response.data.positivePoints,
        userId: response.data.userId
      });
      console.log(this.state)
      console.log("game posted")

      axios.get('/isUser').then(function(response) {
        console.log("isuser data: " + response.data)
      })

    }.bind(this))
}

var endGameFunction = function(fullScore,reactionTimes,gameId,userId,callback){
	axios.post('/gameEnd', {
      gameId: gameId,
      score: fullScore,
      reactionTimes: reactionTimes,
      userId: userId

    }).then(function(response) {
      console.log('end game posted')
      // if(response.data.success){
      //   this.props.history.push('/gameOver');
      // }

      axios.post('/gameOver',{
        userId: response.data.userId,
        passedLevel:response.data.passedLevel,
        gameId:response.data.gameId
      }).then(function(response){
        // if(response.data.success){
        //   this.props.history.push('/gameOver');
        // }
        // this.props.history.push('/gameOver');
        return callback(response.data.success)
      }.bind(this))


    }.bind(this))
}

module.exports={
	endGameFunction:endGameFunction,
	startGameFunction: startGameFunction
}