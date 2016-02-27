"use strict";

class MongoDb {
    var MongoClient = require('mongodb').MongoClient;


    constructor(dataBase) {
        this.MongoClient.connect("mongodb://localhost:27017/" + dataBase, function (err, db) {
            if (!err) {
                console.log("We are connected");
                this.db = db;
            }
        });
    }

    get connection() {
        return this.db;
    }


}
