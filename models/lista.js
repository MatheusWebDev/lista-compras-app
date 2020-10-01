const mongoose = require("mongoose");
const item = mongoose.model('Item');

const listaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Nome não pode estar vazio!'
    },
    store: {
        type: String,
        default: 'Não definido'
    },
    itens: [item.schema],
    createDate: {
        type: Date,
        default: Date.now()
    }
});

listaSchema.static('findItem', findItem);

function findItem(_id) {
    return item.findById(_id);
}

const Lista = mongoose.model('Lista', listaSchema);

module.exports = Lista;
