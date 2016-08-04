var mongoose = require('mongoose')


var userSchema = mongoose.Schema({

	username:String,
	name:String,
	email:String,
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

userSchema.methods.combineMaxNCurrentGame = function(maxN2,currentGame2){
	for(var mode in this.maxN){
		if(this.maxN[mode]<maxN2[mode]){
			this.maxN[mode] = maxN2[mode];
		}
	}
	console.log("maxN combined")
	for(var i=0;i<currentGame2.length;i++){
		currentGame2[i].user = this._id;
		currentGame2[i].save();
	}
	this.save();
}




module.exports = mongoose.model('User',userSchema)
