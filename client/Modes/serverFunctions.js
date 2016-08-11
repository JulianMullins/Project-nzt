var React = require('react');
var axios = require('axios');

var startGameFunction = function(mode, N, callback) {
  console.log("startGameFunction")
  axios.post('/api/startGame/' + mode + '/' + N).then(function(response) {
    if (!response.data.authorized) {
      console.log("unauthorized")
      return callback(true)
    }
    console.log("start game posted", response)
    return callback(null, {
      tempUser: response.data.tempUser,
      gameId: response.data.gameId,
      modeMultiplier: response.data.modeMultiplier,
      penalty: response.data.penalty,
      positivePoints: response.data.positivePoints
    });
    console.log(this.state)
    console.log("game posted")

    axios.get('/api/isUser')
    .then(function(response) {
      console.log("isuser data: " + response.data)
    })

  }.bind(this))
}

var endGameFunction = function(fullScore, reactionTimes, gameId, accuracy, callback) {
  axios.post('/api/gameEnd', {
    gameId: gameId,
    score: fullScore,
    reactionTimes: reactionTimes,
    accuracy: accuracy
  }).then(function(response) {
    if(response.data.success){
      console.log('end game posted')
      // if(response.data.success){
      //   this.props.history.push('/gameOver');
      // }

      axios.post('/api/gameOver', {
        passedLevel: response.data.passedLevel,
        gameId: response.data.gameId,
        accuracy: response.data.accuracy
      }).then(function(response) {
        // if(response.data.success){
        //   this.props.history.push('/gameOver');
        // }
        // this.props.history.push('/gameOver');
        console.log("gameOver response: "+response.data.success)
        return callback(response.data)
      }.bind(this))
    }
  }.bind(this))
}

module.exports = {
  endGameFunction: endGameFunction,
  startGameFunction: startGameFunction
}
