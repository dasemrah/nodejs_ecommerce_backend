const mongoose = require('mongoose');
const musteriModel=new mongoose.Schema({
    ad          :   String,
    telefon     :   String,
    adres       :   String,
    katılma     :   Date,
    siparisler  :  [{type:mongoose.Schema.Types.ObjectId}],
    kuponlar    :   [],
})
module.exports=mongoose.model('Musteri',musteriModel)
