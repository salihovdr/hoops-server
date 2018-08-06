
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  time: { type: Date, required: true },
  court: { type: String, required: true },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
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