const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  pin: {
      lat:{type: Number, required:true},
      lng:{type: Number, required: true}
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  products: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
