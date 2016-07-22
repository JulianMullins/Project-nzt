var Chart = require('chart.js');
var User = require('../models/User');
var Stats = require('../models/Stats');
var _ = require('underscore');

var express = require('express');
var router = express.Router();


var ctx = document.getElementById("myChart");


router.get('/myStats/month')



var chartInstance = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        title: {
            display: true,
            text: 'Custom Chart Title'
        }
    }
})