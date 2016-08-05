var mongoose = require('mongoose');
var autoref = require('mongoose-autorefs');


var gameSchema = mongoose.Schema({
	gameUser:{
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

gameSchema.plugin(autoref,[
	'gameUser.currentGame',
	'finalScore.fromGameId'
])

module.exports = mongoose.model('Game',gameSchema)
