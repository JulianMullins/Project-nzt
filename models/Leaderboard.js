var mongoose = require('mongoose')


var leaderboardSchema = mongoose.Schema({
	user:String,
	scores: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'HighScore'
	}]
})

leaderboardSchema.methods.mergeScoresArrays=function(scores2){
	var newScores=[];
	var scores2index = 0;
	if(scores2.length==0){
		newScores = this.scores;

		return newScores;
	}
	else if(this.scores.length==0){
		this.scores=newScores;
		return scores2;
	}

	for (var thisScoresIndex = 0, scores2index = 0;
	   thisScoresIndex < this.scores.length && scores2index < scores2.length;){
		// moose: If array 1 and 2 index checks are in the for loop declaration
		// this can be moved outside for loop too.
		if(this.scores[i].score<scores2[scores2index].score){
		  newScores.push(this.scores[i]);
		  thisScoresIndex++;
		}
		else{
		  newScores.push(scores2[scores2index]);
		  scores2index++;
		}
	}
	//console.log(newScores)
	if(scores2index<scores2.length){
		newScores = newScores.concat(scores2.slice(scores2index))
	}
	else if(thisScoresIndex<this.scores.length){
		newScores = newScores.concat(this.scores.slice(thisScoresIndex))
	}
	//console.log(newScores);
	this.scores = newScores;
	return newScores;
}

module.exports = mongoose.model('Leaderboard',leaderboardSchema)
