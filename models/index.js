const mongoose = require("mongoose");
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/todolist-app', { useNewUrlParser: true });
//mongoose.Promise = Promise;

module.exports.User = require("./user");
module.exports.Item = require("./item");
module.exports.Category = require("./category");
