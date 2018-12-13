const mongoose = require("mongoose");

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
        required: 'Categoria do item não pode estar vazio!'
    }
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;
