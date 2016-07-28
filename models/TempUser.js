var mongoose = require('mongoose')


var tempUserSchema = mongoose.Schema({
	username:String,
	maxN:{
		classic:Number,
		relaxed:Number,
		silent:Number,
		advanced:Number
	},
	temp: Boolean,
	stats:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Stats'
	},
	currentGame:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game'
	}]
})



module.exports = mongoose.model('TempUser',tempUserSchema)
