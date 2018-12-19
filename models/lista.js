const mongoose = require("mongoose");
const itemSchema = mongoose.model('Item').schema;

const listaSchema = new mongoose.Schema({
   name: {
      type: String,
      required: 'Nome não pode estar vazio!'
   },
   store: {
      type: String,
      default: 'Não definido'
   },
   itens: [itemSchema],
   createDate: {
      type: Date,
      default: Date.now()
   }
});

const Lista = mongoose.model('Lista', listaSchema);

module.exports = Lista;
