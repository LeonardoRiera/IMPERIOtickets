import mongoose from 'mongoose';
import TicketSchema from '../../models/Ticket';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await mongoose.connect(process.env.API_URL_MONGODB);

  try {
    const { entryId } = await req.json();

    // Buscar la entrada en la base de datos
    const ticket = await TicketSchema.findOne({ entry_id: entryId });

    if (!ticket) {
      return NextResponse.json(
        { valid: false, message: 'Entrada no encontrada' },
        { status: 404 }
      );
    }

    if (ticket.status === 'used') {
      return NextResponse.json(
        { valid: false, message: 'Entrada ya utilizada' },
        { status: 409 }
      );
    }

    // Actualizar el estado a "used"
    const updatedTicket = await TicketSchema.findOneAndUpdate(
      { entry_id: entryId },
      { status: 'used' },
      { new: true }
    );

    return NextResponse.json({
      valid: true,
      message: 'Entrada validada exitosamente',
      ticket: updatedTicket
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al procesar la validación' },
      { status: 500 }
    );
  }
}