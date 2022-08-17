const express = require('express');
const router = express.Router();
const modules = require('../isler/modules')
const yenisparis=require('../isler/yenisiparis')
const upload     = require('../isler/sign_s3');

router.get('/zaman',(req,res)=>{
    res.json({zaman:new Date().toString().replace(/T/, ':').replace(/\.\w*/, '')})
})
///yeni kategori ekle
router.post('/yenikategori',modules.yeniKategoriEkle);
//tüm kategorileri ver
router.get('/kategoriler',modules.kategoriler)
//bir kategoriiyi ürün ve görselleri ile populate edip ver
router.get('/kategori/:kategori_ID',modules.kategori)
///Yeni ürün ekle
router.post('/urunekle',modules.urunekle)
//Tüm ürünler
router.get('/urunler',modules.tumurunler)
//bir ürünü ver
router.get('/urun/:urunid',modules.birurun)
//belli seviyedeki siparişleri al
router.get('/siparisler/:seviye',modules.siparisler)
//seviye artır
 router.post('/seviye',modules.seviye)
//TÜm Siparişleri ver
router.get('/tumsiparisler',modules.tumsiparisler)
  //Sipariş sorgula
  router.get('/sorgula/:numara',modules.sorgula)
//Sipariş Sil
 router.post('/siparissil',modules.siparissil)
 ///Sipariş OLuştur
  router.post('/yenisiparis',yenisparis.yenisiparis)
//sipariş düzenle
router.post ('/siparisduzenle',modules.siparisduzenle)
router.get('/tarih/:ay',modules.tarih)
router.post('/sign',upload.sign_s3)
router.get('/uruntum',modules.uruntum)
router.get('/musteriler',modules.musteriler)
router.post('/urunduzenle',modules.urunduzenle)
router.post('/yukle',modules.yukle)
router.post('/gorselver',modules.gorselver)
router.post('/iptal',modules.iptal)
router.get('/s',(req,res)=>{
   console.log(process.env.NODE_ENV)
})

module.exports=router;
