var mongoose = require('mongoose')


var userSchema = mongoose.Schema({
	username: String,
	email: String,
	password: String,
	facebookId: String,
	maxN:{
		classic:Number,
		relaxed:Number,
		silent:Number,
		advanced:Number
	},
	stats:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Stats'
	},
	temp:Boolean,
	currentGame:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game'
	}]
})



module.exports = mongoose.model('User',userSchema)
