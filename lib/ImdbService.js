"use strict";

class ImdbService {

    constructor(db) {
        this.imdb = db.collection("imdb");
    }

    static makeError(statusCode, message) {
        return {
            Error: {
                code: statusCode,
                message: message
            }
        }
    }

    getAllSeries(req, res) {
        this.imdb.find({}).toArray(function (err, items) {
            var seriesArray = [];

            for (var i = 0; i < items.length; i++) {
                seriesArray.push(new Series(items[i]._id, items[i].title).getSmallInfo());
            }
            res.json(seriesArray);
        });
    }

    getSpecificSeries(req, res) {
        var id = req.params.id;

        this.imdb.findOne({_id: id}, function (err, item) {
            if (!item)
                return res.status(404).json(ImdbService.makeError(404, "Welcome to my place, it's nothing here atm but check again in like 1000 years or so!"));
            res.json(item);
        });
    }

    createSeries(req, res) {
        var body = req.body;
        var series = new Series(body.id, body.title);
        if (!series.isValid()) return res.json({});

        var self = this;
        this.imdb.findOne({_id: series.id}, function (err, item) {
            if (item)
                return res.json({error: new Error("Error: Already in database, conflict")});

            self.insertOne(series.convertToMongoDbItem());
            res.json(series);
        });
    }

    updateSeries(req, res) {
        res.json({message: "not implimented yet"})
    }


}

class Series {

    constructor(id, title, options) {
        options = options || {};

        this.title = title || null;
        this.id = id || null;

        this.year = options.year || null;
        this.imgLink = options.imgLink || null;
        this.seasons = options.seasons || null;
    }

    getSmallInfo() {
        return {
            id: this.id,
            title: this.title
        }
    }

    convertToMongoDbItem() {
        return {
            _id: this.id,
            title: this.title,
            year: this.year,
            imgLink: this.imgLink,
            seasons: this.seasons
        }
    }

    isValid() {
        return this.title && typeof this.title === "string" && this.id && typeof this.id === "string";
    }
}


module.exports = ImdbService;