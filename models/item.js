var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Nome não pode estar vazio!'
    },
    amount: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        default: 0.01
    },
    category: {
        type: String,
        default: 'Todos'
    }
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;

module.exports.getItems = function (callback, limit) {
   Item.find(callback).limit(limit);
};

module.exports.create = function (newItem, callback) {
   Item.create(newItem, callback);
};

module.exports.update = function(query, update, callback){
  Item.update(query, update, callback);
};

module.exports.delete = function (query, callback) {
    Item.deleteOne(query, callback);
};