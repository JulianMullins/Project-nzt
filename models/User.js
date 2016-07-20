var mongoose = require('mongoose')


var userSchema = mongoose.Schema({
	username: String,
	email: String,
	password: String,
	facebookId: String
})



module.exports = mongoose.model('User',userSchema)
