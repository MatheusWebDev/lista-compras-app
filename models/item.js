const mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Nome não pode estar vazio!'
    },
    amount: {
        type: Number,
        default: 1.00
    },
    price: {
        type: Number,
        default: 0.00
    },
    category: {
        type: String,
        required: 'Categoria do item não pode estar vazio!'
    },
    imgUrl: {
        type: String,
        default: "http://via.placeholder.com/300"
    }
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;
