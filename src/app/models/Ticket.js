import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  payment_id: { type: String, required: true },
  entry_id:{ type: String, required: true, unique:true},
  email: { type: String, required: true },
  count: { type: Number, required: true },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Tickets = mongoose.models.Tickets || mongoose.model('Tickets', ticketSchema);

export default Tickets;