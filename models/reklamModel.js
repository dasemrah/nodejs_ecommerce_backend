const mongoose = require('mongoose');
const ReklamModel=mongoose.Schema({
    img:String
})
module.exports=mongoose.model('Reklam',ReklamModel)
