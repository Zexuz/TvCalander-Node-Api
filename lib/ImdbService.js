"use strict";

var Service = require("./Service");


class ImdbService extends Service {


    constructor() {
        super();
        var self = this;

        this._methods = [

            {
                method: "GET",
                path: "Series",
                _function: self.getAllSeries
            },

            {
                method: "GET",
                path: "Series/Id",
                _function: self.getSeries
            }

        ];


    }

    getSeries(){
        return {info: "and this is a specific series"}
    }

    getAllSeries() {
        return {info: "this is all the series!"}
    }

}

module.exports = ImdbService;