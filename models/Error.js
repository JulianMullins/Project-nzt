 var mongoose = require('mongoose');

 var errorSchema = new mongoose.Schema({
 	type: String,
 	message: String,
 	isLiveMode: Boolean,
 	time: Date
 })

 module.exports=mongoose.model('ErrorModel',errorSchema)