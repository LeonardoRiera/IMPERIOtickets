import mongoose from 'mongoose';
import TicketSchema from '../../models/Ticket';

export async function POST(req) {
  await mongoose.connect(process.env.API_URL_MONGODB);

  try {
    const body = await req.json();

    const {entryId} = body

    console.log('Hola soy el id',entryId)

    // // Buscar la entrada en la base de datos
    // const ticket = await TicketSchema.findOne({ entry_id: entryId });

    // if (!ticket) {
    //   return Response.json(
    //     { valid: false, message: 'Entrada no encontrada' },
    //     { status: 404 }
    //   );
    // }

    // if (ticket.status === 'used') {
    //   return Response.json(
    //     { valid: false, message: 'Entrada ya utilizada' },
    //     { status: 409 }
    //   );
    // }

    // // Actualizar el estado a "used"
    // const updatedTicket = await TicketSchema.findOneAndUpdate(
    //   { entry_id: entryId },
    //   { status: 'used' },
    //   { new: true }
    // );

    return Response.json({
      success: true,
      valid: true,
      message: 'Entrada validada exitosamente'
    }, {status: 200})
  } catch (error) {
    return Response.json(
      { error: 'Error al procesar la validación', error },
      { status: 500 }
    );
  }
}