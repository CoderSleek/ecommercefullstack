const mongoose = require('mongoose');

const {Schema} = mongoose;

userSchema = {
  username: String,
  password: String,
  hasValidated: {
    type: Boolean,
    default: false
  },
  cartList: {
    type: Array,
    default: []
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
};

const UserModel = new mongoose.model('users4', userSchema);
module.exports = UserModel;