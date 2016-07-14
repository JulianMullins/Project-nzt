var mongoose = require('mongoose')
//var findOrCreate = require('mongoose-findorcreate')


var gameSchema = mongoose.Schema({
	userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
  score:Number,
  mode:Object,
  nArray:Array
})





module.exports = mongoose.model('Game',gameSchema)
