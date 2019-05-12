const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

var db = mongoose.connection;


const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    userName: {type:String},
    data:{type:Buffer,contentType: String}

});

var imageByUser = module.exports = mongoose.model('product', productSchema);


module.exports.getAllImageByUser = function (username,callback) {
    var query = {userName : username};
    imageByUser.find(query,callback);
}