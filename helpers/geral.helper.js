// Access Control
exports.checkIsLogged = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Você não está autorizado a visualizar esta página');
        res.redirect('/login');
    }
}

// Check Object is Empty
exports.isEmpty = function (obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
