import mongoose from 'mongoose';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

import TicketSchema from '../../models/Ticket';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.API_URL_MONGODB);
};

export async function POST(req) {
  const response = await req.json();
  const { email, count: quantity, ticketId: payment_id } = response.external_reference;

  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Verificar si la compra ya fue procesada
    const existingTicket = await TicketSchema.findOne({ 
      payment_id,
      status: 'active'
    }).session(session);

    if (existingTicket) {
      await session.abortTransaction();
      return new Response(null, { status: 200 });
    }

    // Generar UN SOLO QR con el ticketId (payment_id)
    const qrBase64 = await QRCode.toDataURL(payment_id, { scale: 8 });

    // Crear PDFs (todos con el mismo QR pero diferentes nombres si querés)
    const mailAttachments = [];
    for (let i = 0; i < quantity; i++) {
      const pdfBase64 = await generatePDFWithQR(qrBase64);
      mailAttachments.push({
        filename: `entrada_${payment_id}_${i + 1}.pdf`,
        content: pdfBase64,
        encoding: "base64",
      });
    }

    // Crear un único documento para la compra
    const newTicket = new TicketSchema({
      payment_id,
      email,
      count: quantity,
      status: 'active'
    });

    await newTicket.save({ session });

    // Enviar email con todas las entradas
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      },
    });

    await transporter.sendMail({
      from: '"Imperio Tickets" <imperiotickets@gmail.com>',
      to: email,
      subject: "Entradas adjuntas",
      text: "Aquí están tus entradas.", // Versión en texto plano para clientes que no soportan HTML
      html: `<!DOCTYPE html>
                <html lang="es">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Tu Entrada</title>
                  </head>
                  <body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, sans-serif; color:#000;">
                    <div style="max-width:600px; margin:auto; padding:20px; border:1px solid #ddd;">
                      <div style="text-align:center; margin-bottom:20px;">
                        <img src="https://i.postimg.cc/C586Cw8g/Portada-Mail.png" alt="Logo de Imperio Tickets" style="max-width:600px; margin:auto">
                      </div>
                      <h1 style="color:#ffffff; text-align:center; background-color:#000; padding:10px 0; border-radius:15px;">
                        ¡Gracias por tu compra!</h1>

                      <p style="margin:20px 0;">Ya podés disfrutar de tu entrada digital para el evento. A continuación, te compartimos los datos importantes:</p>

                      
                      <p style="margin-bottom:15px;">⚠️ <strong>IMPORTANTE:</strong> TU ENTRADA ES UN QR CON UN ID ÚNICO y te será requerido en el lugar de acceso al evento. El mismo será escaneado para habilitarte el ingreso.</p>

                      <p style="margin-bottom:30px;">Una vez recibido el mail con tu entrada, ES TU RESPONSABILIDAD EVITAR DUPLICADOS ya que sólo se habilitará a la primer persona que ingrese con cada QR.</p>


                      <div style="margin-top:30px; font-size:12px; color:#666; text-align:center;">
                        Si tenés dudas, escribinos a <a href="mailto:imperiotickets@gmail.com">imperiotickets@gmail.com</a><br>
                        ¡Nos vemos en el evento!
                      </div>
                    </div>
                  </body>
                  </html>`,
      attachments: mailAttachments,
    });

    await session.commitTransaction();
    console.log("Entradas generadas y email enviado!");
    
  } catch (error) {
    await session.abortTransaction();
    console.error("Error:", error);
    return new Response(null, { status: 500 });
  } finally {
    session.endSession();
  }

  return new Response(null, { status: 200 });
}

  // Función para generar el PDF con el QR
  
  const generatePDFWithQR = async (qrBase64) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([60, 150]);
  
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const qrImage = await pdfDoc.embedPng(qrBase64);
  
    // === Logo (posición exacta como en el PDF) ===
    const imagePath = path.join(process.cwd(), "public", "assets", "imagologoTickets.png");
    const logoImage = await pdfDoc.embedPng(fs.readFileSync(imagePath));

    // Rectangulo
    page.drawRectangle({
      x: 0,
      y: 140,
      width: 138,
      height: 10,
      borderWidth: .5,
      borderColor: rgb(1,1,1),
      color: rgb(0, 0, 0),
    })

    page.drawImage(logoImage, {
      x: 10,
      y: 142,
      width: 40,
      height: 6,
    });
  
    // === Texto principal (formato exacto) ===
    page.drawText("¡LLEGÓ LA ENTRADA PARA TU EVENTO!", { // Texto en una línea
      x: 10,
      y: 135, // Posición exacta
      size: 2,
      font,
      color: rgb(0, 0, 0),
    });

    // === QR (posición exacta como en el PDF) ===
    page.drawImage(qrImage, {
      x: 18,
      y: 106,
      width: 22,
      height: 22,
    });

    
    // Rectangulo pero del medio guache
    page.drawRectangle({
      x: 0,
      y: 95,
      width: 150,
      height: 8,
      borderWidth: 5,
      color: rgb(0, 0, 0),
    })

  
    // === Detalles del evento (texto y posiciones exactas) ===
    page.drawText("FECHA : 3 DE MAYO", { x: 20, y: 101, size: 2, font, color: rgb(1, 1, 1) });
    page.drawText("HORA : 21 HS", { x: 23, y: 98, size: 2, font, color: rgb(1, 1, 1) });
    page.drawText("LUGAR : GALPÓN BLANCO", { x: 16, y: 95, size: 2, font, color: rgb(1, 1, 1)}); // "CALPON" como en el PDF
  
      
    // === Bloque "IMPORTANTE" (saltos de línea y orden exactos) ===
    page.drawText("IMPORTANTE", { x: 23, y: 89, size: 2, font, color: rgb(0, 0, 0) });


    // === Web (posición exacta) ===
    page.drawText("www.imperiotickets.com", {
      x: 4,
      y: 3,
      size: 3.5,
      font,
      color: rgb(0, 0, 0),
    });


  
    const importantLines = [
      "TU ENTRADA ES UN QR CON UN",
      "ID ÚNICO Y TE SERÁ REQUERIDO",
      "EN EL LUGAR DE ACCESO DEL",
      "EVENTO",
      "", // Espacio exacto
      "EL MISMO SERÁ ESCANEADO",
      "PARA HABILITARTE EL INGRESO",
      "", // Espacio exacto
      "UNA VEZ RECIBIDO EL MAIL CON",
      "TU ENTRADA ES TU RESPONSABILIDAD",
      "EVITAR DUPLICADOS",
      "", // Espacio exacto
      "SOLO SE HABILITARÁ A LA",
      "PRIMERA PERSONA QUE INGRESE",
      "CON ESTE QR",
    ];
  
    let y = 77; // Posición inicial exacta
    importantLines.forEach((line) => {
      page.drawText(line, { x: 4, y, size: 2, font, color: rgb(0, 0, 0) });
      y -= 4; // Espaciado exacto entre líneas
    });
  
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes).toString("base64");
  };
  