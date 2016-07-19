var mongoose = require('mongoose')


var leaderboardSchema = mongoose.Schema({
	user:String,
	scores: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'HighScore'
	}]
})

module.exports = mongoose.model('Leaderboard',leaderboardSchema)
