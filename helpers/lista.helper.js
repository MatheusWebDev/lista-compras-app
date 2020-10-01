var lista = require("../models/lista");

exports.getAll = function (req, res) {
    lista.find()
        .then(function (categories) {
            res.json(categories);
        })
        .catch(function (err) {
            res.send(err);
        })
}

exports.create = function (req, res) {
    lista.create(req.body)
        .then(function (newCategory) {
            res.status(201).json(newCategory);
        })
        .catch(function (err) {
            res.send(err);
        });
}

exports.getSingle = function (req, res) {
    lista.findById(req.params.id)
        .then(function (foundCategory) {
            res.json(foundCategory);
        })
        .catch(function (err) {
            res.send(err);
        });
}

exports.update = function (req, res) {
    lista.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(function (updatedCategory) {
            res.json(updatedCategory);
        })
        .catch(function (err) {
            res.send(err);
        });
}

exports.delete = function (req, res) {
    lista.deleteOne({ _id: req.params.id })
        .then(function () {
            res.json({ message: "Deletado com sucesso!" });
        })
        .catch(function (err) {
            res.send(err);
        });
}

exports.addItem = function (req, res) {
    lista.findById(req.params.id)
        .then(function (foundLista) {
            lista.findItem(req.body.id)
                .then(function (item) {
                    foundLista.itens.push(item);
                    foundLista.save(err => {
                        if (err) {
                            res.send(err);
                        } else {
                            res.json({ message: "Item successfully added!" });
                        }
                    });
                });
        })
        .catch(function (err) {
            res.send(err);
        });
}

exports.delItem = function (req, res) {
    lista.findById(req.params.id)
        .then(function (foundLista) {
            foundLista.itens.pull(req.body.id);
            foundLista.save(err => {
                if (err) {
                    res.send(err);
                } else {
                    res.json({ message: "Item Deletado com sucesso!" });
                }
            });
        })
        .catch(function (err) {
            res.send(err);
        });

}

module.exports = exports;