import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  payment_id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  count: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'used'], 
    default: 'active' 
  }
}, { timestamps: true });

const Tickets = mongoose.models.Tickets || mongoose.model('Tickets', ticketSchema);

export default Tickets;