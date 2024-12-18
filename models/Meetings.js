const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  meetingId: { type: String, required: true },
  topic: { type: String, required: true },
  start_time: { type: Date, required: true },
  duration: { type: Number, required: true },
  agenda: { type: String, default: '' },
  password: { type: String, required: true },
  groupId: { type: mongoose.Schema.ObjectId, ref: 'Group', required: true },
}, { timestamps: true });

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;