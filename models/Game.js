var mongoose = require('mongoose')


var gameSchema = mongoose.Schema({
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
  anonUser:Boolean,
	mode:String,
	score:Number,
	nLevel:Number
})



module.exports = mongoose.model('Game',gameSchema)
