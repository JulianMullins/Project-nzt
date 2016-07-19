var mongoose = require('mongoose')


var statsSchema = mongoose.Schema({
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	leaderboard:Object
})


module.exports = mongoose.model('Stats',statsSchema)
