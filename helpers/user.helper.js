var user = require("../models/user");

exports.getAll = function (req, res) {
    user.find()
        .then(function (itens) {
            res.json(itens);
        })
        .catch(function (err) {
            res.send(err);
        })
}

exports.create = function (req, res) {
    req.checkBody('name', 'Campo NOME é obrigatorio').notEmpty();
    req.checkBody('email', 'Campo E-MAIL é obrigatorio').notEmpty();
    req.checkBody('email', 'Preencha com um endereço de E-MAIL valido').isEmail();
    req.checkBody('username', 'Campo USERNAME é obrigatorio').notEmpty();
    req.checkBody('password', 'Campo SENHA é obrigatorio').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.json({ errors: errors });
    } else {
        user.registerUser(req.body, (err, newUser) => {
            if (err) throw err;
            res.json({ message: "Você está registrado. Pode fazer Login.", newUser: newUser });
        });
    }
}

exports.getSingle = function (req, res) {
    user.findById(req.params.id)
        .then(function (foundItem) {
            res.json(foundItem);
        })
        .catch(function (err) {
            res.send(err);
        });
}

exports.update = function (req, res) {
    if (!req.body.password) {
        user.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then(function (updatedItem) {
                res.json(updatedItem);
            })
            .catch(function (err) {
                res.json(err);
            });
    } else {
        res.json({ message: "Não é possível atualizar a senha!" });
    }
}

exports.delete = function (req, res) {
    user.deleteOne({ _id: req.params.id })
        .then(function () {
            res.json({ message: "Deletado com sucesso!" });
        })
        .catch(function (err) {
            res.send(err);
        });
}

module.exports = exports;