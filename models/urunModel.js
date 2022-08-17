const mongoose = require('mongoose');

const urunSchema = new mongoose.Schema({
      ad        :   String,
      aciklama  :   String,
      fiyat     :   Number,
      img       :   [],
      kategori  :  {type:mongoose.Schema.ObjectId, ref:'Kategori'},
      net       :   String,
      satinalim :    Number,
      aktif     :    Boolean,
      indirimde :    Boolean,
      gorsel    :    {
          type  :   mongoose.Schema.Types.ObjectId,
          ref   : 'Img'
      }
});

module.exports=mongoose.model('Urunler',urunSchema);
