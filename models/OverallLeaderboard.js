var mongoose = require('mongoose');
var autoref = require('mongoose-autorefs');


var overallLeaderboardSchema = mongoose.Schema({
	user:String,
	scores: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'HighScore'
	}]
})

//overallLeaderboardSchema.plugin(autoref,[]);

module.exports = mongoose.model('OverallLeaderboard',overallLeaderboardSchema)