require('dotenv').config()
const   siparis=require('../models/siparisModel')
const   musteri=require('../models/musteriModel');
const   Urun=require('../models/urunModel')
var     PhoneNumber = require( 'awesome-phonenumber' );
var     AWS = require('aws-sdk')
//AWS
AWS.config = new AWS.Config()
AWS.config.accessKeyId = process.env.AWSAccessKeyId;
AWS.config.secretAccessKey = process.env.AWSSecretKey;
const sns = new AWS.SNS();
AWS.config.update({region: process.env.region});
//AWS




mesajGonder=(numara,ucret,urunler)=>{

    let urun=urunler.map(urun=>{return  String(urun.net)+' kg '+String(urun.ad)+' '})
    var mesaj=String(' Nazlı KÖy  🛍 '+urun+'siparişiniz'+' başarıyla alındı! TOPLAM ÖDEMENİZ GEREKEN ÜCRET: ' +ucret+'₺  Ödemenizi yaptığınızda ürünü hazırlayıp kargoya veriyoruz. Ödemenizi aşağıdaki hesaba yaptıktan sonra  +905432196263 numaralı telefona mesaj atarak bize haber veriniz. \n IBAN NO: IBAN_NUMARASI HESAP_ADI')

    var params = {
        Message: mesaj, /* required */
        PhoneNumber: numara,
    };
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
    publishTextPromise.then(
        function(data) {
            console.log("MessageID is " + data.MessageId);
        }).catch(
        function(err) {
            console.error(err, err.stack);
        });

}


exports.yenisiparis=(req,res)=>{
    let {data}=req.body;
    console.log('Sipariş----->',data)

    var pn = new PhoneNumber(data.telefon, 'TR' )
    var telefon=pn.getNumber()
    console.log('veri',data)

    var siparisnesne={
        ad          :   data.ad,
        telefon     :   telefon,
        adres       :   data.adres,
        detay       :   data.detay,
        ucret       :   data.ucret,
        tarih       :   data.tarih,
        odeme       :   data.odeme_yontemi,
        Urunler     :   data.urunler,
        durum       :   0,
        kapida      :   data.kapida,
        paket       :   data.paket
    }



         siparis.create(siparisnesne)
        .then((foundSiparis)=>{
            musteri
                .findOne({telefon:siparisnesne.telefon})
                .then(bulunanMusteri=>{
                console.log('sorgu sonucu',bulunanMusteri)
                if(bulunanMusteri ===null){
                    console.log('müşteri bulunanamadı')
                    musteri.create({
                        ad          :   siparisnesne.ad,
                        telefon     :   siparisnesne.telefon,
                        adres       :   siparisnesne.adres,

                    })
                        .then(olusanMusteri=>{
                        console.log('müşteri oluştu',olusanMusteri)
                            musteri.findOne({_id:olusanMusteri._id}).then(ynt=>{
                                ynt.siparisler.push(foundSiparis)
                                ynt.save()
                            })
                            .catch(err=>console.log(err))
                    })
                        .catch(err=>console.log(err))
                }else {
                    console.log('müşteri bulundu--->',bulunanMusteri)
                    bulunanMusteri.siparisler.push(foundSiparis)
                    bulunanMusteri.save()
                }
            })
                .catch(err=>console.log('hata',err))


           // mesajGonder(telefon,data.ucret,data.urunler)
        res.send({olay:true,siparis:foundSiparis})
        })
        .catch((err)=>{
            res.send({olay:0})
            console.log(err)
        })




}
