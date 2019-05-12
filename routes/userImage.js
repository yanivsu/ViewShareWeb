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
            console.log(res.locals.user.email);
            /*Collect all the image by the User*/
            imgProduct.getAllImageByUser(res.locals.user.email,function (err,image) {
                if(err)
                    res.send("Error with DB connection");
                else {
                    if (image.length == 0) {
                        res.render('user');
                    } else {
                       // console.log(image[0].data.toString('base64'));
                        imageToSend = image;
                        var imageJSON = JSON.stringify({
                            _id: image[0]._id,
                            name: image[0].name,
                            userName: image[0].userName,
                            data: image[0].data
                        });
                        res.render('user');
                    }
                }
            });

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
hbs.registerHelper('list',function () {
    imgProduct.getAllImageByUser(this.user._doc.email, function (err, image) {
        if (err) {

            return "Error with DB connection";
        }
        else {
            if(image.length != 0)
                imageToSend = image;
             else
                 imageToSend = 0;
        }
    });
        if(imageToSend == 0){
            return "You dont upload image yet";
        }
        else {
            //return imageToSend.length;

            var ret = "";

            for(var i=0, j=imageToSend.length; i<j; i++) {
                ret = ret + "<img src=" + '"data:image/jpeg ;base64,' + imageToSend[i].data.toString('base64') +'"</img>';
            }
      //<img src="data:image/gif;base64,">
            console.log(ret);
            return ret;

        }
});

module.exports = router;