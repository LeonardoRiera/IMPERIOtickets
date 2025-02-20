import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  password: { type: String, required: true },
  repeat_password: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return value === this.password;
      },
      message: 'Las contraseñas no coinciden'
    }
  },
  status: { type: Number, default: 0 }
}, { collection: 'Usuarios' });

// Middleware para eliminar repeat_password antes de guardar
registerSchema.pre('save', function(next) {
  this.repeat_password = undefined;
  next();
});

const Register = mongoose.model('Entry', registerSchema);

export default Register;
