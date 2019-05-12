var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var router = express.Router();
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var multer = require('multer');
var upload = require('express-fileupload');

/*Product Image Var*/
var Product = require('../models/product');

/*Must to upload image to mongoDB*/
var storage = multer.diskStorage({
    destination: function (req,file,callback) {
        callback(null,'./uploads');
    },
    filename: function (req,file,callback) {
        callback(null,new Date().toISOString() + file.filename)
    }
});

var uploadWithMulter = multer({storage:storage});

router.use(upload()); // configure middleware


router.post('/',uploadWithMulter.single('productImage'),function (req,res) {


    console.log(req.files);
    var file = req.files.MyImage;
    console.log(file);
   // var bitmap = fs.readFileSync(file);
    console.log(file.data);

    var newProduct = new Product({
        _id:mongoose.Types.ObjectId(),
        name: file.name,
        userName:res.locals.user.email,
        data: file.data
    });

    newProduct.save();
    req.flash('success_msg','Your Picture is uploaded');
    res.redirect('/upload');
   // res.redirect('/upload',{message:req.flash("success_msg","Your Picture is uploaded")});

});
/* GET upload page. */
router.get('/', ensureAuthenticated,function(req, res, next) {
    console.log("INDEX RENDER")
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/';
    /*Check the connection with DB*/
    MongoClient.connect(url,function (err,db) {
        if(err){
            console.log('Unable to connect to the sever',err)
            res.send("Error with connection to DB at this time");
        }
        else
            console.log("Connection Established")
    });
    //send to upload page.
    res.render('upload');
});
function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error_msg","You are not logged in");
        res.redirect('/login');
    }
}
module.exports = router;