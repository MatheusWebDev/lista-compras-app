const mongoose = require("mongoose");
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/todolist-app', { useNewUrlParser: true });
//mongoose.Promise = Promise;

module.exports.Category = require("./category");
module.exports.User = require("./user");
module.exports.Item = require("./item");
