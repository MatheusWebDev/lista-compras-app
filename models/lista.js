const mongoose = require("mongoose");
const db = require("./models");

const listaSchema = new mongoose.Schema({
   name: {
      type: String,
      required: 'Nome não pode estar vazio!'
   },
   mercado: {
      type: String,
      default: 'Não definido'
   },
   itens: [db.model('Item').Schema]
});

const Lista = mongoose.model('Lista', listaSchema);

module.exports = Lista;
