var category = require("../models/category");

exports.getAll = function (req, res) {
    category.find()
        .then(function (categories) {
            res.json(categories);
        })
        .catch(function (err) {
            res.send(err);
        })
}

exports.create = function (req, res) {
    category.create(req.body)
        .then(function (newCategory) {
            res.status(201).json(newCategory);
        })
        .catch(function (err) {
            res.send(err);
        });
}

exports.getSingle = function (req, res) {
    category.findById(req.params.id)
        .then(function (foundCategory) {
            res.json(foundCategory);
        })
        .catch(function (err) {
            res.send(err);
        });
}

exports.update = function (req, res) {
    category.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(function (updatedCategory) {
            res.json(updatedCategory);
        })
        .catch(function (err) {
            res.send(err);
        });
}

exports.delete = function (req, res) {
    category.deleteOne({ _id: req.params.id })
        .then(function () {
            res.json({ message: "Deletado com sucesso!" });
        })
        .catch(function (err) {
            res.send(err);
        });
}

module.exports = exports;