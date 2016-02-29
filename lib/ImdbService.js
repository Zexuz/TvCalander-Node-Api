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
                var currentItem = items[i];

                var series = {
                    id: currentItem._id,
                    title: currentItem.title
                };

                seriesArray.push(series);
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
        if (!(body.title && body.id)) return res.json({});

        var self = this;
        this.imdb.findOne({_id: body.id}, function (err, item) {
            if (item)
                return res.json({error: new Error("Error")});

            self.insertOne({_id: body.id, title: body.title});
            res.json({_id: body.id, title: body.title});
        });
    }

    updateSeries(req,res){
        res.json({message:"not implimented yet"})
    }


}

module.exports = ImdbService;