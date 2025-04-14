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
    const qrBase64 = await QRCode.toDataURL(payment_id, { scale: 3 });

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
      text: "Aquí están tus entradas.",
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

    // 1. Primero dibujamos el fondo azul
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 60,
      height: 150,
      color: rgb(138/255, 102/255, 102/255),
    })

  
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const qrImage = await pdfDoc.embedPng(qrBase64);
  
    const imagePath = path.join(process.cwd(), "public", "assets", "imagotipoLetraNegra.png");
    const logoImage = await pdfDoc.embedPng(fs.readFileSync(imagePath));
  
    page.drawImage(logoImage, {
      x: 10,
      y: 140,
      width: 40,
      height: 8,
    });
  
    page.drawText("¡Tu entrada para el evento!", {
      x: 5,
      y: 130,
      size: 4,
      font,
      color: rgb(0,0,0),
    });
  
    page.drawText("Fecha: 1 de Marzo de 2025", {
      x: 5,
      y: 120,
      size: 3,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawText("Hora: 21hs.", {
      x: 5,
      y: 100,
      size: 3,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawText("Ubicación: Galpón Blanco - El Andino", {
      x: 5,
      y: 90,
      size: 3,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawText("Tu Id de entrada es: ", {
      x: 10,
      y: 80,
      size: 3,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawImage(qrImage, {
      x: 20,
      y: 50,
      width: 20,
      height: 20,
    });
  
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes).toString('base64');
  }