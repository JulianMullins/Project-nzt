var mongoose = require('mongoose')
var autoref = require('mongoose-autorefs');

var friendsleaderboardSchema = mongoose.Schema({
	FLuser:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	scores: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'HighScore'
	}],
	friends:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]
})

friendsleaderboardSchema.plugin(autoref,[
	'FLuser.friendsLeaderboard'
])



module.exports = mongoose.model('FriendsLeaderboard',friendsleaderboardSchema)
