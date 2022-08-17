const express=require('express');
const router=express.Router();

const slayt=require('../models/slaytModel')

///Slayt fotoğraflarını ver
router.get('/slayt',(req,res)=>{
    slayt.find()
        .then((foundSlayt)=>{
       res.send(foundSlayt)
    })
        .catch(err=>console.log(err))
})
//Slayt fotoğrafları ekle

router.post('/yenislayt',(req,res)=>{
    console.log('url',req.body)
    let newSlayt={
        link:req.body.url,
        text:req.body.text
    }
    slayt.create(newSlayt)
        .then(foundNewSlayt=>{
            console.log(foundNewSlayt)
            res.send(foundNewSlayt)
        }).catch(err=>console.log(err))

});



module.exports=router;
