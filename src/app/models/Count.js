import mongoose from 'mongoose';

const entryCounterSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

const EntryCounter = mongoose.models.EntryCounter || mongoose.model('EntryCounter', entryCounterSchema);

export default EntryCounter;
