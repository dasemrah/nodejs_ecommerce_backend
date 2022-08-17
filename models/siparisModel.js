const mongoose = require('mongoose');
const siparisSchema = new mongoose.Schema({
    ad          :   {type:String,text:true,index:true},
    telefon     :   String,
    userid      :   String,
    adres       :   String,
    detay       :   String,
    ucret       :   String,
    odeme       :   String,
    kapida      :   String,
    paket       :   Boolean,
    durum       : {type:Number,default:0},
    tarih       :   Date,
    Urunler     :   []
});
module.exports = mongoose.model('siparis',siparisSchema);
