const mongoose = require('mongoose');
const slaytModel = new mongoose.Schema({
    link:String,
    text:String
})
module.exports=mongoose.model('Slayt', slaytModel)
