//gerekliler
var PhoneNumber     = require( 'awesome-phonenumber' );
const moment        = require('moment');

//modeller
const siparis       = require('../models/siparisModel');
const urun          = require('../models/urunModel');
const Img           = require('../models/imgModel');
const Kategoriler   = require('../models/kategoriModel');
const Musteri       = require('../models/musteriModel');

////////////////////////////fonksiyonlar

exports.siparissil=(req,res)=>{
    console.log('gelen id',req.body)
    siparis.findByIdAndDelete(req.body.siparisid)
        .then(ynt=>{
            console.log(ynt)
            res.send({
                ynt:ynt,
                olay:1
            })
        })
        .catch(err=>{
            console.log(err)
            res.send({
                ynt:'',
                olay:0
            })
        })
}

//sipariş düzenle
exports.siparisduzenle = (req, res) => {
    console.log(req.body)
    let {ad, telefon, adres, detay, ucret, odeme, Urunler,_id} = req.body
    console.log('nesne-->',ad,telefon,adres,detay,ucret,_id)
        siparis
        .findByIdAndUpdate(_id, {
            ad      : ad,
            telefon : telefon,
            adres   : adres,
            detay   : detay,
            ucret   : ucret,
            odeme   : odeme,
            kapida  : req.body?.nesne?.kapida,
            Urunler : Urunler
        })
        .then(obj=> {
            console.log('kaydedildi',obj)
            res.json({
                status:true,
                siparis:obj,
                msg:'kaydedildi'
            })
        })
        .catch(err => {
            console.log(err)
            res.json({
                status:false,
                msg:err
            })
        })
}


//ürün düzenle
exports.urunduzenle=(req,res)=>{
    let {nesne}=req.body
    console.log('gelen veriler',nesne)
    urun.findByIdAndUpdate(nesne._id,{
        ad          : nesne.ad,
        aciklama    : nesne.aciklama,
        net         : nesne.net,
        fiyat       : nesne.fiyat,
        gorsel      : nesne.gorsel,
        aktif       : nesne.aktif,
        indirimde   : nesne.indirimde
    })
        .then(ynt=>{
            console.log('kaydedildi---->',ynt)
            urun
                .findOne({_id:ynt._id})
                .populate('gorsel')
                .then(founUrun=>{
                console.log('bulunan',founUrun)
                res.send({
                    status:true,
                    nesne:founUrun
                })
            })
        })
        .catch(err=>{
            console.log(err)
            res.send({
                status: false,
                nesne:err
            })
        })
}

//sorgula
exports.sorgula=(req,res)=>{
    let siparisler=[]
    var pn = new PhoneNumber(req.params.numara, 'TR' )
    var telefon=pn.getNumber()

    siparis.find({telefon:telefon})
        .then((found)=>{
            console.log(found)
          if(found.length >0){
              res.json({
                  siparis:found,
                  status:true,
                  msg:'bulundu'
              })
          }else {
              res.json({
                  status:false,
                  siparis:[],
                  msg:'bulunamadı'
              })
          }
        }).catch(err=>console.log(err))
}
//yeni kategori Ekle
exports.yeniKategoriEkle=(req,res)=>{
    Kategoriler.create({
        ad   :  req.body.ad,
        renk :  req.body.renk
    }).then(newKategori=>{
        console.log(newKategori)
        res.send(newKategori);
    }).catch(err=>console.log(err))
}
//tüm kategorileri ver
exports.kategoriler=(req,res)=>{
    Kategoriler
        .find()
        .populate({path:'Urunler',})
        .exec((err,foundKategoriler)=>{
            if(err)console.log(err)
            else {
                console.log(foundKategoriler)
                res.send(foundKategoriler)
            }
        })
}
//bir karegori seç ürün ve görselleriyle populate et
exports.kategori=(req,res)=>{
    let kategori_ID = req.params.kategori_ID
    console.log('katerogi  id',kategori_ID)
    Kategoriler
        .findOne({_id:kategori_ID})
        .populate({
            path:'urunler',
            populate:{
                path:'gorsel'
            }
        })
        .then(cvp=>{
            res.json({msg:'Bulundu',status:true,urunler:cvp.urunler})
        })
}
//belli seviyedeki siparişleri ver
exports.siparisler=(req,res)=>{
    console.log('seviye',req.params.seviye)
    siparis
        .find({durum:req.params.seviye})
        .then(foundOrders=>{
            console.log('getirilen siparişler',foundOrders)
            res.json({
                orders:foundOrders
            })
        })
        .catch(err=>console.log(err))

}


//tüm siprişler
exports.tumsiparisler=(req,res)=>{
    siparis
        .find()
        .sort({tarih:-1})
        .then((ynt)=>{
        res.send({siparis:ynt})
    }).catch((err)=>console.log(err))
}
//sipariş seviyesini artır
exports.seviye=(req,res)=>{
    let {siparisid, seviye} = req.body
    console.log('ürün bilgileri',siparisid, '    ----->',seviye)
    siparis
        .findByIdAndUpdate(siparisid,{durum:seviye})
        .then(ynt=>{
            console.log('siparis seviyesi değişti',ynt)
            res.send({order:ynt})
        })
        .catch(err =>console.log(err))
}
//bir ürünü ver
exports.birurun=(req,res)=>{
    urun.findById(req.params.urunid).then((foundUrun)=>{
        console.log(foundUrun);
        res.send(foundUrun)
    })
        .catch((err)=>{
            console.log(err);
        })
}
//tüm ürünler
exports.tumurunler =(req,res)=>{
    Kategoriler
        .find()
        .populate({
            path:'urunler'
        })
        .then((foundUrun)=>{
        res.send({foundUrun})
    }).catch((err)=>console.log(err))
}
///ürün görsellerini ver
exports.gorselver=(req,res)=>{
    console.log('görsel isteği geldi')
    let {gorselID} = req.body
    Img
        .findOne({_id:gorselID})
        .then(foundIMG=>{
            console.log('sorgu sonucç verdi')
           if(foundIMG !== null){
               res.json({img:foundIMG})
           }
        })
}


//ürün ekle
exports.urunekle = (req,res) => {
    let data = req.body
    console.log('Gelen veriler: ',data)

    let urunnesne={
        ad        :   data.ad,
        aciklama  :   data.aciklama,
        fiyat     :   data.fiyat,
        gorsel    :   data.gorsel,
        kategori  :   data.kategorid,
        net       :   data.net,
        satinalim :   0,
        aktif     : true
    }
    urun
        .create(urunnesne)
        .then((yeniUrun)=>{
        Kategoriler
            .findById(data.kategorid)
            .then(foundKategori=>{
                foundKategori.urunler.push(yeniUrun);
                foundKategori.save()
            })
            .catch(err=>console.log(err))
        console.log('ürün olutu--->',yeniUrun)
        res.json({msg:'başarılı', status:true, urun:yeniUrun})
    }).catch((err)=>console.log(err))


}

//sipariş ara


exports.uruntum=(req,res)=>{
    urun
        .find()
        .then(foundUrun=>res.send(foundUrun))
        .catch(err=>console.log(err))
}
exports.tarih=  (req,res)=>{
    var dizi=[]
    moment().dayOfYear(0)
    const before = moment().startOf('month')
              siparis.find(
                  {"tarih": {
                          "$gte":  before.add(-(parseInt(req.params.ay)),'month').toDate(),
                          "$lt" :  before.add(1,'month').toDate()}
                  })
                  .sort({tarih:1})
                  .then(ynt=>{
                      res.send(ynt)


                  })
                  .catch(err=>res.send(err))



}




exports.yukle=(req,res)=>{
    let {name, type, data} = req.body

    console.log('veriler---->',name, '---->', type)
    Img.findOne({data:data}).then(foundImg=>{
        if(foundImg===null){
            Img
                .create({name:name, contentType:type, data:data})
                .then(newImg=>{
                    console.log('görsel oluştu',newImg._id)
                    res.json({img:newImg})
                })
                .catch(err=>console.log(err))
        }else {
            console.log('aynı görselden var',foundImg._id)
            res.json({img:foundImg})
        }
    })


}

exports.musteriler=(req,res)=>{
    Musteri
        .find()
        .sort('ad')
        .then(foundMusteri=>{
            console.log('bulunan müşteriler',foundMusteri)
            res.json({msg:'ok' ,status:true, musteri:foundMusteri})
        })
        .catch(err=>console.log(err))
}
exports.iptal=(req,res)=>{
    let {siparisID} = req.body
    console.log('siparişid',siparisID)
     siparis
        .findOne({_id:siparisID})
        .then(foundSiparis => {
            let yapar = foundSiparis.durum ===0
            console.log('sipariş bulundu',yapar, foundSiparis)
            if(yapar) {
                console.log('silinebilir')
                siparis
                    .findByIdAndDelete(foundSiparis._id)
                    .then(cvp => {
                        res.json({msg: 'silindi', status:true, siparis:cvp})
                    })
                    .catch(err => {
                        console.log(err)
                        res.json({msg: 'hata', status:false})
                    })
            }
        })
}