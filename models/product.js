const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

var db = mongoose.connection;


const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    userName: {type:String},
    description:{type:String},
    country:{type:String},
    data:{type:Buffer,contentType: String}
});

var imageByUser = module.exports = mongoose.model('product', productSchema);


module.exports.getAllImageByUser = function (username,callback) {
    console.log(username);
    var query = {userName : username};
    imageByUser.find(query,callback);
}