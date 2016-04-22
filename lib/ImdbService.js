"use strict";

class ImdbService {

    constructor(db) {
        this.imdb = db.collection("imdb");
    }

    static makeError(res, statusCode, message) {
        res.status(statusCode).json({
            success: false,
            data: {
                Error: {
                    code: statusCode,
                    message: message
                }
            }
        })
    }

    getAllSeries(req, res) {
        var seriesArray = [];
        var self = this;

        self.imdb.find({}).toArray(function (err, items) {
            var data = {};
            if (err) {
                data.success = false;
                data.data = null;
                res.json(data);
                return;
            }

            for (var i = 0; i < items.length; i++) {
                if (items[i]._id === "0000000")continue;
                seriesArray.push(new Series(items[i]._id, items[i].title, items[i]).getSmallInfo());
            }

            data.success = true;
            data.data = seriesArray;

            res.json(data);
        });
    }

    getSpecificSeries(req, res) {
        var id = req.params.id;
        var self = this;

        if (id === "0000000") {
            ImdbService.makeError(res, 400, "Config id, please use ImdbService/<version>/Info");
            return;
        }

        this.imdb.findOne({_id: id}, function (err, item) {
            if (err || !item) {
                ImdbService.makeError(res, 404, "Welcome to my place, it's nothing here atm but check again in like 1000 years or so!");
                return;
            }

            var data = {};
            data.success = true;
            data.data = new Series(item._id, item.title, item);

            res.json(data);
        });
    }

    createSeries(req, res) {
        var body = req.body;
        var series = new Series(body.id, body.title, body);

        if (!series.isValid()) return ImdbService.makeError(res, 400, "Bad request");

        var self = this;
        this.imdb.findOne({_id: series.id}, function (err, item) {
            if (item)
                return ImdbService.makeError(res, 409, "Item already in database");

            var data = {};
            data.success = true;
            data.data = self.imdb.insertOne(series.convertToMongoDbItem());
            res.json(data);
        });
    }

    updateSeries(req, res) {
        var body = req.body;
        var id = req.params.id;
        var series = new Series(id, body.title, body);

        if (!series.isValid()) return ImdbService.makeError(res, 400, "Bad request");

        var self = this;
        this.imdb.findOne({_id: series.id}, function (err, item) {
            var data = {};
            if (err) {
                return ImdbService.makeError(res, 500, "Internal Server Error");
            }

            if (item) {
                self.imdb.updateOne({_id: series.id}, series, function (err) {
                    if (err) {
                        return ImdbService.makeError(res, 500, "Internal Server Error");
                    }

                    data.success = true;
                    data.data = series;
                    res.json(data);
                });
            } else {


                self.imdb.insertOne(series.convertToMongoDbItem(), function (err) {
                    if (err) {
                        return ImdbService.makeError(res, 500, "Internal Server Error");
                    }

                    data.success = true;
                    data.data = series;
                    res.json(data);
                });
            }

        });
    }

    getInfo(req, res) {
        var self = this;
        this.imdb.findOne({_id: "0000000"}, function (err, item) {
            if (err) {
                return ImdbService.makeError(res, 500, "Internal Server Error");
            }

            var data = {};

            if (!item) {
                data.lastModified = Math.floor(new Date().getTime()) - 10;
                data.lastScraped = Math.floor(new Date().getTime()) - 10;
                data.nextScrape = Math.floor(new Date().getTime()) - 10;
                data._id= "0000000";

                self.imdb.insertOne(data);
                return res.json(data);;
            }



            data.success = true;
            data.data = {};
            data.data.lastModified = item.lastModified;
            data.data.lastScraped = item.lastScraped;
            data.data.nextScrape = item.nextScrape;

            res.json(data);

        });
    }

    editInfo(req, res) {
        var self = this;
        this.imdb.findOne({_id: "0000000"}, function (err, item) {
            if (err) {
                return ImdbService.makeError(res, 500, "Internal Server Error");
            }

            if (!item) {
                return ImdbService.makeError(res, 404, "Not found");
            }

            var body = req.body;

            item.lastModified = body.lastModified || item.lastModified;
            item.lastScraped = body.lastScraped || item.lastScraped;
            item.nextScrape = body.nextScrape || item.nextScrape;

            self.imdb.updateOne({_id: "0000000"}, item, function (err) {
                if (err) {
                    return ImdbService.makeError(res, 500, "Internal Server Error");
                }


                var data = {};

                data.success = true;
                data.data = {};
                data.data.lastModified = item.lastModified;
                data.data.lastScraped = item.lastScraped;
                data.data.nextScrape = item.nextScrape;

                res.json(data);
            });

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
            title: this.title,
            year: this.year,
            imgLink: this.imgLink
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