var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


/* GET home page. */
router.get('/',ensureAuthenticated ,function(req, res, next) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/'
  MongoClient.connect(url,function (err,db) {
    if(err){
      console.log('Unable to connect to the sever',err)
    }
    else
      console.log("Connection Established")
  });
  res.render('index', { title: 'ViewShare' });
});
router.get('/register', function(req, res, next) {

  res.render('register');
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/places',ensureAuthenticated, function(req, res, next)
{
  console.log('Places Function is running now!')

  res.render('places');
});
router.get('/USA', function(req, res, next)
{
  console.log('USA Function is running now!')

  res.render('USA', { title: 'USA' });
});
router.get('/Africa', function(req, res, next)
{
  console.log('Africa Function is running now!')

  res.render('Africa', { title: 'Africa' });
});
/* Post home Page */
router.post('/USA',function (req,res,next) {

  console.log("Now we try to send the picture");
  //Get an ID Button
  var id = Object.values(req.body);

  var img = fs.readFileSync('public/usaAlbum/' + id +'.jpg');

  res.writeHead(200, {'Content-Type': 'image/gif' });
  res.end(img, 'binary');

});
/* Post home Page */
router.post('/Africa',function (req,res,next) {

  console.log("Now we try to send the picture aaaaaa");
  //Get an ID Button
  var id = Object.values(req.body);

  var img = fs.readFileSync('public/afircaAlbum/' + id[0] +'.jpg');

  res.writeHead(200, {'Content-Type': 'image/gif' });
  res.end(img, 'binary');

});
router.post('/register', function(req, res) {
  console.log(req.body);
  /*Create the object to user [0] = First Name , [1] = Last Name , [2] = Email , [3] = Password*/
  var newUser = Object.values(req.body);
  var firstName = newUser[0];
  var lastName = newUser[1];
  var email = newUser[2];
  var password = newUser[3];


  var errors = req.validationErrors();
  if(errors){
    res.send("Error with the register!");
  }
  else{
    var newUser = new User({
      firstname : firstName,
      lastname : lastName,
      email : email,
      password : password
    });
    console.log(newUser.toString())

    User.createUser(newUser,function (err,user) {
      if(err){
        throw err;
        console.log(user);
      }
    });
    req.flash('success_msg','You Registered now you can login!');

    res.redirect('/login');
  }

});
passport.use(new LocalStrategy({
  /*Use pass Req callback to use Req.flash message*/
  passReqToCallback : true
}, function(req, username, password, done){
      console.log("Check Password in local DB");
      User.getUserByUserName(username,function (err,user)
      {
        if(err){
          throw err;
        }
        if(!user)
        {
          console.log("User not Found in DB");
          return done(null,false,{message :req.flash("error_msg","Unknown User")});
        }
        User.comparePassword(password,user.password,function (err,isMatch) {
            if(err)throw err;
            if(isMatch)
            {
              console.log("The password is correct :)");
              return done(null,user);
            }
            else   {
              return done(null,false,{message:req.flash("error_msg","Invalid Password")});
            }
        })
      }) ;
    }));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});
router.post('/Login',
    passport.authenticate('local', { successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true })
);
router.get('/Logout',function (req,res) {

  req.logout();
  req.flash("success_msg","You are Logged out");
  res.redirect('/login');
});
/*This function created to make sure the user is connected !*/
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