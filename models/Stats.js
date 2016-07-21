var mongoose = require('mongoose')


var statsSchema = mongoose.Schema({
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	leaderboard:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Leaderboard'
	},
	totalPoints: Number,
	progress:Array
})


module.exports = mongoose.model('Stats',statsSchema)
