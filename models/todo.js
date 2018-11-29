var mongoose = require("mongoose");

var todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Nome não pode estar vazio!'
    },
    done: {
        type: Boolean,
        default: false
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;

module.exports.getTodos = function (callback, limit) {
   Todo.find(callback).limit(limit);
} 

module.exports.createTodo = function (newTodo, callback) {
   newTodo.save(callback);
}