var mongoose = require('mongoose');


var statsSchema = mongoose.Schema({
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	leaderboard:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Leaderboard'
	},
	totalPoints: {
		type:Number,
		default:0
	},
	progress:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'HighScore'
		}]
})


statsSchema.methods.combineStats=function(stats2){
	
	this.totalPoints+=stats2.totalPoints;
	this.progress = this.progress.concat(stats2.progress);
	this.save();
	console.log("stats combined");
		
}


module.exports = mongoose.model('Stats',statsSchema)
