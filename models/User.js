var mongoose = require('mongoose')


var userSchema = mongoose.Schema({
	username: String,
	name:String,
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

userSchema.statics.combineMaxN = function(maxN2){
	for(var mode in this.maxN){
		if(this.maxN[mode]<maxN2[mode]){
			this.maxN[mode] = maxN2[mode];
		}
	}
	this.save();
}



module.exports = mongoose.model('User',userSchema)
