var mongoose = require('mongoose')


var gameSchema = mongoose.Schema({
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
  	tempUser:Boolean,
	mode:String,
	score:Number,
	nLevel:Number,
	reactionTimes:Array
})



module.exports = mongoose.model('Game',gameSchema)
