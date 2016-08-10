var mongoose = require('mongoose')
var autoref = require('mongoose-autorefs');

var userSchema = mongoose.Schema({

	username:{
		type:String,
		validate:{
			validator:function(val){
				if(val.length<6){
					return false;
				}
				else{
					return true;
				}
			},
			message: 'Username must be at least 6 characters long'
		}
	},
	name:String,
	email:{
		type: String,
		validate:{
			validator: function(val){
				if(!val.includes('@') || !val.includes('.') || val.includes('+')){
					return false;
				}
				else{
					return true;
				}
			},
			message: 'Invalid email address'
		}
	},
	password: {
		type: String,
		validate:{
			validator: function(val){
				if(val.length<6){
					return false;
				}
				else{
					return true;
				}
			},
			message: 'Password must be at least 6 characters long'
		}
	},
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
	showTutorial:{
		type: Boolean,
		default: true
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
	'currentGame.gameUser'
])


module.exports = mongoose.model('User',userSchema)
