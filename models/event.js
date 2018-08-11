
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  time: {type: Date, required: true},
  courtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attending: Number
});

// Add `createdAt` and `updatedAt` fields
eventSchema.set('timestamps', true);

// Customize output for `res.json(data)`, `console.log(data)` etc.
eventSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

module.exports = mongoose.model('Event', eventSchema);