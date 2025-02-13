import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  email: { type: String, required: true },
  entryId: { type: String, required: true, unique: true },
  status: { type: String, default: 'pending' }
}, { collection: 'Entradas' });

const Entry = mongoose.model('Entry', entrySchema);

export default Entry;