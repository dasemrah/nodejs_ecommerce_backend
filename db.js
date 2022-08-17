require('dotenv').config();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
//veritabanı url
const url = process.env.MONGO_URL;

//Vetibanı bağlantısı
const connect = mongoose.connect(url,{useNewUrlParser: true ,useUnifiedTopology: true});

module.exports=connect;
