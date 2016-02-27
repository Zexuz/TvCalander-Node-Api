"use strict";

class Service {


    constructor() {
        this._methods = [];
    }

    router(req, res) {
        var path = req.params.method;
        var id = req.params.id;
        var method = req.method;

        if (id) {
            path += "/Id";
        }

        var matchedObject = this.getMethod(method, path);

        if (!matchedObject) {
            res.status(404).json({
                Error: {
                    code: 404,
                    message: "No such method fund"
                }
            });
            return;
        }
        res.json(matchedObject._function());
    }

    getMethod(method, path) {
        for (var i = 0; i < this._methods.length; i++) {
            if (this._methods[i].method === method && this._methods[i].path === path) {
                return this._methods[i];
            }
        }
    }
}

module.exports = Service;