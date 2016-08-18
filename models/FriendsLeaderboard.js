var mongoose = require('mongoose')
var autoref = require('mongoose-autorefs');

var friendsleaderboardSchema = mongoose.Schema({
	FLuser:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	scores: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'HighScore'
	}],
	friends:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]
})

friendsleaderboardSchema.plugin(autoref,[
	'FLuser.friendsLeaderboard'
])

friendsleaderboardSchema.methods.unique = function(callback){
	var friends = this.friends;
	var newArr = [];
	//console.log("sorting")
	for(var i=0;i<friends.length;i++){
		//console.log("checking")
		//console.log(newArr,friends[i])
		if(newArr.indexOf(friends[i])<0){
			newArr.push(friends[i])
		}
	}
	this.friends = newArr;
	this.save(function(err,myFriendsLeaderboard){
		callback(myFriendsLeaderboard);
	});
}



module.exports = mongoose.model('FriendsLeaderboard',friendsleaderboardSchema)
