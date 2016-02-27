var routerImdbService = require('express').Router();

var ImdbService = require("../lib/ImdbService");
var imdbService = new ImdbService();
var exports = {};


exports.simple= routerImdbService.all("/:method", function (req, res, next) {
    console.log("Call made on ImdbService/v1/method");
    next();
}, imdbService.router.bind(imdbService));


exports.advanced= routerImdbService.all("/:method/:id", function (req, res, next) {
    console.log("Call made on ImdbService/v1/method/id");
    next();
}, imdbService.router.bind(imdbService));


module.exports = routerImdbService;