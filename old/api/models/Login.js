import mongoose from 'mongoose';

const loginSchemma = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
}, { collection: 'Usuarios' });

const Register = mongoose.model('Entry', loginSchemma);

export default Register;
