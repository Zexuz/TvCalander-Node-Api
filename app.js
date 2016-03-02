// server.js
// BASE SETUP
// =============================================================================

var MongoClient = require('mongodb').MongoClient;
var db;

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var Datejs =require("datejs");

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
var ImdbService = require("./lib/ImdbService");
var imdbService;

MongoClient.connect("mongodb://localhost:27017/api", function (err, database) {
    if (!err) {
        console.log("We are connected");
        app.listen(port);
        console.log('Magic happens on port ' + port);
        db = database;
        imdbService = new ImdbService(db);
    } else {
        console.log("not connected!");
    }
});


routerImdbService.get("/Series", function (req, res) {
    printRequestInfo(req);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    imdbService.getAllSeries(req, res);
});


routerImdbService.get("/Series/:id", function (req, res) {
    printRequestInfo(req);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    imdbService.getSpecificSeries(req, res);
});

routerImdbService.post("/Series", function (req, res) {
    printRequestInfo(req);
    imdbService.createSeries(req, res);
});


routerImdbService.put("/Series/:id", function (req, res) {
    printRequestInfo(req);
    imdbService.updateSeries(req, res);
});

var printRequestInfo = function (req) {
    var method = "\nMethod : " + req.method;
    var path = "\nPath : " + req.path;
    var payLoad = req.method === "POST" || req.method === "PUT" ? "\n Payload : " + JSON.stringify(req.body) : "";

    var date = new Date();
    var time = "\nTime : " + date.toString("u").substring(0,date.toString("u").length-1);

    console.log(method + path + payLoad + time);
};