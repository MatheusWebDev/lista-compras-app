var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
   title: {
      type: String,
      required: 'Nome não pode estar vazio!'
   },
   desc: {
      type: String,
      default: ''
   },
   qtdItens: {
      type: Number,
      default: 0
   }
});

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;
