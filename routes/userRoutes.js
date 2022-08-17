var express     = require('express');
var router      = express.Router();
var passport    = require("passport");
var User        = require('../models/userModel');
var LocalStrategy = require("passport-local");




//
router.get('/users',(req,res)=>{
  User.find().then((foundUsers)=>{
    console.log(req.user);
    res.send(foundUsers);
  }).catch((err)=>console.log(err))
});

//giriş yapıldı bilgileri sun
router.get('/loginerr',(req,res)=>{
  res.send({msg:'Şifre eşleşmedi',status:0});
})

//giriş yap
router.post('/signin',(req,res)=>{
  passport.authenticate("local",{ failureRedirect: '/loginerr' })(req, res, ()=>{
    res.send({user:req.user,status:1,msg:'Giriş Ok'});
    console.log(req.user);
  });
});
//çıkış yapıyorum
router.get("/signout", (req, res)=>{
  req.logout();
  res.send({user:req.user,msg:'çıktı'});
});

router.get('/user',(req,res)=>{
  if(req.isAuthenticated()){
    console.log(req.user)
    res.send({user:req.user,status:1})
  }else {
    res.send({status:0})
  }
});

//giriş var mı kontrol et
function isAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/signin");
}
//kayıt oluştur
router.post("/signup",  (req, res)=>{
  console.log(req.body)
  let newUser = new User ({
    username     : req.body.username,
    role         : req.body.role
  });
  User.register(newUser, req.body.password, (err, user)=>{
    if(err){
      console.log(err);
      res.send ({msg:err,status:0});
    }
    passport.authenticate("local")(req, res, ()=>{
      res.send({user:req.user,status:1});
      console.log(req.user);
      console.log('giriş yapıldı')
    });
  });
});
//

module.exports = router;
