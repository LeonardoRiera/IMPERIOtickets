import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  payment_id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  count: { type: Number, required: true },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment;