var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Stats=require('../models/Stats')

var tempGame = null;

router.get('/taco',function(req, res, next){

 //return res.json({stats: [123]})
  console.log("lolololololololol")
  // console.log(req.user.stats,'170')
  Stats.find({_id: req.user.stats}, function(err,stats){
    if(err){
      console.log(err)
    }
    else{
      console.log('foud')
      res.json({stats: stats})
    }
  })
});


  module.exports=router;