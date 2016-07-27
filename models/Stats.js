var mongoose = require('mongoose')


var statsSchema = mongoose.Schema({
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	leaderboard:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Leaderboard'
	},
	totalPoints: Number,
	progress:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'HighScore'
		}]
})


statsSchema.statics.combineStats=function(stats2){
	Stats.findById(stats2,function(err,stats2){
		if(err){
			console.log(err);
		}
		else{
			this.totalPoints+=stats2.totalPoints;
			this.progress = this.progress.concat(stats2.progress);
			Leaderboard.findById(this.leaderboard,function(err,leaderboard1){
				if(err){
				  return err;
				}
				else{
				  Leaderboard.findById(stats2.leaderboard,function(err,leaderboard2){
				    if(err){
				      return err;
				    }
				    else{
				      leaderboard1.mergeScoresArrays(leaderboard2.scores)
				      leaderboard1.save();
				    }
				  })
				  //.remove();
				}
				this.save();
			})
		}
		this.save();
	})
	//.remove();
	this.save();
}


module.exports = mongoose.model('Stats',statsSchema)
