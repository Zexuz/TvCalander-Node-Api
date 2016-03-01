"use strict";

class ImdbService {

    constructor(db) {
        this.imdb = db.collection("imdb");
    }

    static makeError(res, statusCode, message) {
        res.status(statusCode).json({
            Error: {
                code: statusCode,
                message: message
            }
        })
    }

    getAllSeries(req, res) {
        var seriesArray = [];
        this.imdb.find({}).toArray(function (err, items) {
            for (var i = 0; i < items.length; i++) seriesArray.push(new Series(items[i]._id, items[i].title).getSmallInfo());
            res.json(seriesArray);
        });
    }

    getSpecificSeries(req, res) {
        var id = req.params.id;
        var self = this;

        this.imdb.findOne({_id: id}, function (err, item) {
            if (!item)
                return ImdbService.makeError(404, "Welcome to my place, it's nothing here atm but check again in like 1000 years or so!");
            res.json(new Series(item._id, item.title, item));
        });
    }

    createSeries(req, res) {
        var body = req.body;
        var series = new Series(body.id, body.title, body);

        if (!series.isValid()) return ImdbService.makeError(400, "Bad request");

        var self = this;
        this.imdb.findOne({_id: series.id}, function (err, item) {
            if (item)
                return ImdbService.makeError(409, "Item already in database");

            self.imdb.insertOne(series.convertToMongoDbItem());
            res.json(series);
        });
    }

    updateSeries(req, res) {
        var body = req.body;
        var id = req.params.id;
        var series = new Series(id, body.title, body);

        if (!series.isValid()) return;

        var self = this;
        this.imdb.findOne({_id: series.id}, function (err, item) {
            if (item) {
                self.imdb.updateOne(
                    {_id: series.id},
                    series,
                    function (err, item) {
                        res.json(series);
                    });
            } else {
                self.imdb.insertOne(series.convertToMongoDbItem());
                res.json(series);
            }
        });
    }


}

class Series {

    constructor(id, title, options) {
        options = options || {};

        this.id = id || null;
        this.title = title || null;

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