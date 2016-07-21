var mongoose = require('mongoose')


var userSchema = mongoose.Schema({
	username: String,
	email: String,
	password: String,
	facebookId: String,
	maxN:Number,
	stats:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Stats'
	},
	temp:Boolean
})



module.exports = mongoose.model('User',userSchema)
