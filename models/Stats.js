var mongoose = require('mongoose');
var autoref = require('mongoose-autorefs');


var statsSchema = mongoose.Schema({
	statsUser:{
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

statsSchema.plugin(autoref,[
	'statsUser.stats',
	'leaderboard.leaderboardBelongsToStats',
	'progress.scoreToStats'
])

module.exports = mongoose.model('Stats',statsSchema)
