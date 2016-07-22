var mongoose = require('mongoose')


var highScoreSchema = mongoose.Schema({
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	dateAchieved:Date,
	score:Number,
	nLevel:Number,
	mode:String,
	reactionTimes: Array
})


module.exports = mongoose.model('HighScore',highScoreSchema)
