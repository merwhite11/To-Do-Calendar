const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');

mongoose.connect('mongodb://localhost/bocauth', { useNewUrlParser: true,
  useUnifiedTopology: true,
  })
  .then(()=> {
    console.log("database connection successful");
  })
  .catch((err)=> {
    console.log("something wrong", err);
  });
 const userSchema =  new mongoose.Schema({
    username: String,
    password: String,
  });

  const userModel = mongoose.model('userModel', userSchema);

  module.exports.userModel = userModel;