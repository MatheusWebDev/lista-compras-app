const objId = require('mongoose').Types.ObjectId;

// Access Control
exports.checkIsLogged = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Você não está autorizado a visualizar esta página');
        res.redirect('/login');
    }
};

// Check Object is Empty
exports.isEmpty = function (obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

// Extract Name ID e Category do ITEM
const extractItem = function (itemSelected) {
    console.log('-----------------------------------------');
    console.log(itemSelected);
    console.log('-----------------------------------------');
    let nameStart = itemSelected.indexOf("name: \'");
    let nameEnd = itemSelected.indexOf("\',\r\n  cat");
    let catStart = itemSelected.indexOf("category: \'");
    let catEnd = itemSelected.indexOf("\',\r\n  __v");
    let idStart = itemSelected.indexOf("\n  _id: ");
    let idEnd = itemSelected.indexOf(",\r\n  n");

    return {
        _id: objId(itemSelected.slice(idStart + 8, idEnd)),
        name: itemSelected.slice(nameStart + 7, nameEnd),
        category: itemSelected.slice(catStart + 11, catEnd),
    };
};

// Adiciona ITEM na LISTA DE COMPRAS
exports.addItemToList = function (itemSelected, lista) {
    let itemToAdd = extractItem(itemSelected);

    if (!lista.itens.some(i => i.name === itemToAdd.name)) {
        lista.itens.push(itemToAdd);
    }
};

// Converte o ID to ObjectID
exports.toObjId = function (id) {
    return objId(id);
};