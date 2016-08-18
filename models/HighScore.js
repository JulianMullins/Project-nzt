var mongoose = require('mongoose')
var autoref = require('mongoose-autorefs');

var highScoreSchema = mongoose.Schema({
  scoreToStats: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stats'
  },
  tempUser: Boolean,
  userName: {
    type: String,
    required: true
  },
  FBname: String,
  dateAchieved: Date,
  score: Number,
  nLevel: Number,
  mode: String,
  reactionTimes: Array,
  fromGameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  scoreBoard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Leaderboard'
  }
})


highScoreSchema.plugin(autoref, [
  'scoreToStats.progress',
  'fromGameId.finalScore',
  'scoreboard.scores'
])

module.exports = mongoose.model('HighScore', highScoreSchema)
