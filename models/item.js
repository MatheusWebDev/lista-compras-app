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
        required: 'Preço não pode estar vazio!'
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
} 

module.exports.createItem = function (newItem, callback) {
   Item.create(newItem, callback);
}