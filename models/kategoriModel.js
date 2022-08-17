const mongoose = require('mongoose');
const KategoriModel = mongoose.Schema({
    ad      :String,
    renk    :String,
    urunler :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Urunler'
    }]
})
module.exports=mongoose.model('Kategori',KategoriModel);
