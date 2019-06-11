var express = require('express');
var fs = require('fs');
var router = express.Router();
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var multer = require('multer');
var upload = require('express-fileupload');

/*Product Image Var*/
var Product = require('../models/product');
router.use(upload()); // configure middleware
router.post('/',function (req,res) {


    var file = req.files.MyImage;
    if(req.files.MyImage==undefined)
    {
        req.flash('error_msg','You need to select file first');
        res.redirect('/upload');
    }
    /*Covnert to Json Pruduct and save it to mongo*/
    var newProduct = new Product({
        _id:mongoose.Types.ObjectId(),
        name: file.name,
        userName:res.locals.user.email,
        data: file.data,
        description: req.body.description,
        country: req.body.country
    });

    newProduct.save();
    req.flash('success_msg','Your Picture is uploaded');
    res.redirect('/upload');
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