var mongoose = require('mongoose')
var autoref = require('mongoose-autorefs');

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
	}],
	showTutorial:Boolean,
	friendsLeaderboard:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'FriendsLeaderboard'
	}
})

userSchema.methods.combineMaxN = function(maxN2){
	for(var mode in this.maxN){
		if(this.maxN[mode]<maxN2[mode]){
			this.maxN[mode] = maxN2[mode];
		}
	}
	console.log("maxN combined")
	this.save();
}

userSchema.plugin(autoref,[
	'stats.statsUser',
	'currentGame.gameUser',
	'friendsLeaderboard.FLuser'
])


module.exports = mongoose.model('User',userSchema)
