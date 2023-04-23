const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskTag' }]
});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag