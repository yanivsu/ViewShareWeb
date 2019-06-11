var express = require('express');
var mongodb = require('mongodb');
var exphbs = require('exphbs');
var router = express.Router();
var hbs = require('hbs');

var imgProduct = require('../models/product');
var imageToSend = [];
router.get('/',ensureAuthenticated,function (req,res) {
    //find all the user images
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/';
    /*Check the connection with DB*/
    MongoClient.connect(url,function (err,db) {
        if(err){
            console.log('Unable to connect to the sever',err)
            res.send("Error with connection to DB at this time");
        }
        else {
            console.log("Connection Established");
            res.render('user');
        }
    });

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

/*Helps me to send the Json data with handlebars helper*/


module.exports = router;