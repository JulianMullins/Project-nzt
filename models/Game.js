var mongoose = require('mongoose')


var gameSchema = mongoose.Schema({
	user:Object,
  anonUser:Boolean,
	mode:String,
	score:Number,
	nLevel:Number
})



module.exports = mongoose.model('Game',gameSchema)
