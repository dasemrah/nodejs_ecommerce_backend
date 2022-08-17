
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const passport      = require('passport');
const mongoose      = require('mongoose');
const LocalStrategy = require('passport-local');
var User        = require('./models/userModel');
const multer        = require('multer');
const fs            = require('fs');
var session = require('express-session');
var bodyParser = require('body-parser')
const formData = require('express-form-data')
const ExtraRoutes=require('./routes/extrasRoutes')
const connector     = require('./db');
//yolları ekle
const indexRouter   = require('./routes/indexRoutes');
const userRouter    = require('./routes/userRoutes');
var app = express();
app.use(formData.parse())
process.env.TZ = 'Europe/Istanbul';
app.use(function(req, res, next) {
  var allowedOrigins = ['https://www.nazlikoy.com', 'https://nazlikoy.com', 'http://localhost:3000'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  // Pre-flight isteği olursa
  if('OPTIONS' === req.method){
    return res.send(200)
  }
  next()
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}))

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

///Passport modülü
app.use(session({ secret: 'anything' ,saveUninitialized:true,resave:true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy (User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Route
app.use(indexRouter);
app.use(userRouter);
app.use(ExtraRoutes)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//Şuanki kullanıcıyı tüm route'larla paylaş
app.use ((req, res, next)=>{
  res.locals.currentUser=req.user;
  next();
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
