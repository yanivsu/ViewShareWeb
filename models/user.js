var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017');

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
    firstname : {
        type:String,
        index:true
    },
    lastname : {
        type:String,
        index:true
    },
    password : {
       type:String
    },
    email : {
       type:String
    }
});

var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function (newUser,callback) {
    bcrypt.genSalt(10, function(err, salt)
    {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}


module.exports.getUserByUserName = function (username,callback) {
    var query = {email : username};
    User.findOne(query,callback);
}

module.exports.getUserById = function (id,callback) {
    User.findById(id,callback);
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword, hash, function(err, res) {
        if(err)
            throw err
        callback(null,res);
    });
}
