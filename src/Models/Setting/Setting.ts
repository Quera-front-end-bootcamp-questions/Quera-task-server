const mongoose = require('mongoose');
const settingSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  theme: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Setting = mongoose.model('Setting', settingSchema);

export default Setting