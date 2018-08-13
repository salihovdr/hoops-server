
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  photo: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI0W5GiVGQtfywv5wQ3Pby57eDu0FUclk1JjLIFQY49qoLJq36' },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.set('timestamps', true);

// Customize output for `res.json(data)`, `console.log(data)` etc.
userSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

userSchema.methods.serialize = function () {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    photo: this.photo || '',
    id: this.id || ''
  };
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };