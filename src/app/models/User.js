// models/User.js
import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema({
  email:    { type: String, required: true },
  password: { type: String, required: true }
}, { collection: 'Usuarios' });

export default mongoose.models.User || mongoose.model('User', loginSchema);
