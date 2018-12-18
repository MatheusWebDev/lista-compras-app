const mongoose = require("mongoose"),
    bcrypt = require('bcryptjs');

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

module.exports = User;

module.exports.registerUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) console.log(err);
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log(err);
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function (username, callback) {
    const query = { username }
    User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}
