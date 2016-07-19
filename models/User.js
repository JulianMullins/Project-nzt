var mongoose = require('mongoose')
//var findOrCreate = require('mongoose-findorcreate')


var userSchema = mongoose.Schema({
	username: String,
	email: String,
	password: String,
	facebookId: String,
  highScores: Object,
  settings: Object,
	cumulativeScore: Number,
	games:Array
})



module.exports = mongoose.model('User',userSchema)
