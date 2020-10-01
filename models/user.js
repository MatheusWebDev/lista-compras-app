const mongoose = require("mongoose"),
    bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Nome não pode estar vazio!'
    },
    email: {
        type: String,
        required: 'E-mail não pode estar vazio!'
    },
    username: {
        type: String,
        required: 'Username não pode estar vazio!'
    },
    password: {
        type: String,
        required: 'Senha não pode estar vazio!'
    }
});

const User = mongoose.model("User", UserSchema);
const saltRounds = 8;

module.exports = User;

module.exports.registerUser = function (newUser, callback) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) callback(err);
        bcrypt.hash(String(newUser.password), salt, (err, hash) => {
            if (err) callback(err);
            newUser.password = hash;
            var user = new User(newUser);
            user.save(callback);
        });
    });
}

module.exports.getUserByUsername = function (username, callback) {
    User.findOne({ username }, callback);
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(String(candidatePassword), hash, (err, isMatch) => {
        if (err) throw err;
        callback(isMatch);
    });
}
