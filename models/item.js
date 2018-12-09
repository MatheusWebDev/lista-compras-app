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
