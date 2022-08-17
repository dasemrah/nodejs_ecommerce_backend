const mongoose = require('mongoose');

const imgModel = new mongoose.Schema({
        name        :String,
        data        :String,
        contentType :String
})
module.exports=mongoose.model('Img',imgModel)
