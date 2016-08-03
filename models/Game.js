var mongoose = require('mongoose')


var gameSchema = mongoose.Schema({
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
  	tempUser:Boolean,
	mode:String,
	baseScore:Number,
	fullScore:Number,
	nLevel:Number,
	reactionTimes:Array,
	accuracy:{
		type: Number,
		min:0,
		max:1
	},
	isHighScore:Boolean,
	finalScore:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'HighScore'
	}
})



module.exports = mongoose.model('Game',gameSchema)
