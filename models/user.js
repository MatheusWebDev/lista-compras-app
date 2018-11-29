const mongoose = require("mongoose"),
      bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String
});

const User = module.exports = mongoose.model("User", UserSchema);

module.exports.registerUser = function(newUser, callback){
   bcrypt.genSalt(10, (err, salt) => {
     bcrypt.hash(newUser.password, salt, (err, hash) => {
       if(err){
         console.log(err);
       }
       newUser.password = hash;
       newUser.save(callback);
     });
   });
 }
 
 module.exports.getUserByUsername = function(username, callback){
   const query = { username }
   User.findOne(query, callback);
 }
 
 module.exports.getUserById = function(id, callback){
   User.findById(id, callback);
 }
 
 module.exports.comparePassword = function(candidatePassword, hash, callback){
   bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
     if(err) throw err;
     callback(null, isMatch);
   });
 }