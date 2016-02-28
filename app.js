// server.js
// BASE SETUP
// =============================================================================

var MongoClient = require('mongodb').MongoClient;
var db;

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
var routerImdbService = require('express').Router();

app.use('/api/ImdbService/v1/', routerImdbService);

// START THE SERVER
// =============================================================================

MongoClient.connect("mongodb://localhost:27017/api", function (err, database) {
    if (!err) {
        console.log("We are connected");
        app.listen(port);
        console.log('Magic happens on port ' + port);
        db = database;

    } else {
        console.log("not connected!");
    }
});


routerImdbService.get("/Series", function (req, res) {
    db.collection('imdb').find({}).toArray(function (err, items) {

        var seriesArray = [];

        for (var i = 0; i < items.length; i++) {
            var currentItem = items[i];

            var series = {
                id: currentItem._id,
                title: currentItem.title
            };

            seriesArray.push(series);
        }


        res.json(seriesArray);
    });
});


routerImdbService.get("/Series/:id", function (req, res) {
    var id = req.params.id;
    db.collection('imdb').findOne({_id: id}, function (err, item) {
        if (!item)
            item = {};
        res.json(item);
    });
});


var findRestaurants = function (db, callback) {

};