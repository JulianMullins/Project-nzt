var mongoose = require('mongoose')


var leaderboardSchema = mongoose.Schema({
	user:String,
	scores: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'HighScore'
	}]
})

leaderboardSchema.methods.mergeScoresArrays=function(scores1,scores2){
	var newScores=[];
	var scores2index = 0;
	if(scores2.length==0){
		newScores = scores1;

		return newScores;
	}
	else if(scores1.length==0){
		scores1=newScores;
		return scores2;
	}

	for (var scores1index = 0, scores2index = 0;
	   scores1index < scores1.length && scores2index < scores2.length;){
		// moose: If array 1 and 2 index checks are in the for loop declaration
		// this can be moved outside for loop too.
		if(scores1[i].score<scores2[scores2index].score){
		  newScores.push(scores1[i]);
		  scores1index++;
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
	else if(scores1index<scores1.length){
		newScores = newScores.concat(scores1.slice(scores1index))
	}
	//console.log(newScores);
	return newScores;
}



module.exports = mongoose.model('Leaderboard',leaderboardSchema)
