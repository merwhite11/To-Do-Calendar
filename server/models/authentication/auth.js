const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') })
const mongoURL = process.env.auth;
const mongoAdmin = process.env.authuser;
const mongoPW = process.env.authpw;
const bocAuth = `mongodb://${mongoAdmin}:${mongoPW}@${mongoURL}:27017/bocauth`;
const bocAuthOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const connection = mongoose.createConnection(bocAuth, bocAuthOptions);
mongoose.connect(bocAuth, bocAuthOptions);

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  firstName: { type: String, required: false},
  googleId: { type: String, required: false},
  lastName: { type: String, required: false}
});

var User = new mongoose.model('User', UserSchema);

var findUserByEmail = async function (email, cb) {
  try{
    User.findOne( {email: email}, function (err, data) {
      if (err){
          cb(err)
      }
      else{
          cb(null, data)
      }
  });
  } catch(err) {
    cb(err);
  }
}

var addNewUser = async function (data, cb) {
    var newUser = new User(data);
    newUser.save(function (err) {
      if (err) {
        cb(err);
      } else {
        cb(null, newUser)
      }
    });
}

module.exports.connection = connection;
module.exports.user = User;
module.exports.addNewUser = addNewUser;
module.exports.findUserByEmail = findUserByEmail;