var item = require("../models/item");

exports.getAll = function (req, res) {
    item.find()
        .then(function (itens) {
            res.json(itens);
        })
        .catch(function (err) {
            res.send(err);
        })
}

exports.create = function (req, res) {
    item.create(req.body)
        .then(function (newItem) {
            res.status(201).json(newItem);
        })
        .catch(function (err) {
            res.send(err);
        });
}

exports.getSingle = function (req, res) {
    item.findById(req.params.id)
        .then(function (foundItem) {
            res.json(foundItem);
        })
        .catch(function (err) {
            res.send(err);
        });
}

exports.update = function (req, res) {
    item.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(function (updatedItem) {
            res.json(updatedItem);
        })
        .catch(function (err) {
            res.send(err);
        });
}

exports.delete = function (req, res) {
    item.deleteOne({ _id: req.params.id })
        .then(function () {
            res.json({ message: "Deletado com sucesso!" });
        })
        .catch(function (err) {
            res.send(err);
        });
}

module.exports = exports;