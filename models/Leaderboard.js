var mongoose = require('mongoose')


var leaderboardSchema = mongoose.Schema({
	mode:String,
	scores: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'HighScore'
	}]
})

module.exports = mongoose.model('Leaderboard',leaderboardSchema)
