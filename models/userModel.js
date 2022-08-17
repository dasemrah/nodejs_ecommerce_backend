const mongoose = require('mongoose');
var passportLocalMongoose  =    require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
      username:String,
      password:String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(require('mongoose-role'), {
    roles: ['public', 'user', 'admin'],
    accessLevels: {
      public: ['public', 'user', 'admin'],
      anon: ['public'],
      user: ['user', 'admin'],
      admin: ['admin']
    }
  })
module.exports=mongoose.model('User',userSchema);