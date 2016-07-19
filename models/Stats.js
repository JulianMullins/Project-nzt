var mongoose = require('mongoose')


var statsSchema = mongoose.Schema({
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	leaderboard:Object,
  totalPoints: Number,
  progress:Array
})


module.exports = mongoose.model('Stats',statsSchema)
