import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

import PaymentSchema from '../../models/Payment';


const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.API_URL_MONGODB);
}

export async function POST(req) {

    const response = await req.json()

    console.log(response)

    // await connectDB();
    
    // const existingPayment = await PaymentSchema.findOne({ payment_id });
    
    // if (existingPayment) {
    //   console.log('Ya existía el id de pago')
    //   return new Response(null, {status: 200});
    // } else {

    // // Crear un nuevo pago en la base de datos
    // const newPayment = new PaymentSchema({
    //   payment_id,
    //   email,
    //   count: parseInt(quantity, 10),
    //   status,
    // });

    // // Guardar el pago en la base de datos
    // await newPayment.save();

    const email = response.external_reference.email;
    const quantity = response.external_reference.count;
    const id = response.external_reference.id;
    
    const mailAttachments = [];

    for (let i = 0; i < quantity; i++) {
      const entryId = nanoid();
      const qrBase64 = await QRCode.toDataURL(entryId, { scale: 5 });
      const pdfBase64 = await generatePDFWithQR(qrBase64);
      mailAttachments.push({
        filename: `entrada_${existingPayment}_${i + 1}.pdf`,
        content: pdfBase64,
        encoding: "base64",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: "imperiotickets@gmail.com",
      to: email,
      subject: "Entradas adjuntas",
      text: "Aquí están tus entradas.",
      attachments: mailAttachments,
    });

    console.log("Correo enviado exitosamente");
    revalidatePath("/");

    // }

    return new Response(null, {status:200})

}


  // Función para generar el PDF con el QR
  const generatePDFWithQR = async (qrBase64) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([60, 150]);
  
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const qrImage = await pdfDoc.embedPng(qrBase64);
  
    const imagePath = path.join(process.cwd(), "public", "assets", "imagotipoLetraNegra.png");
    const logoImage = await pdfDoc.embedPng(fs.readFileSync(imagePath));
  
    page.drawImage(logoImage, {
      x: 10,
      y: 110,
      width: 80,
      height: 30,
    });
  
    page.drawText("¡Tu entrada para el evento!", {
      x: 10,
      y: 90,
      size: 5,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawText("Fecha: 1 de Marzo de 2025", {
      x: 10,
      y: 70,
      size: 3,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawText("Hora: 21hs.", {
      x: 10,
      y: 60,
      size: 3,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawText("Ubicación: Galpón Blanco - El Andino", {
      x: 10,
      y: 50,
      size: 3,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawText("Tu Id de entrada es: ", {
      x: 10,
      y: 40,
      size: 3,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawImage(qrImage, {
      x: 30,
      y: 10,
      width: 60,
      height: 40,
    });
  
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes).toString('base64');
  }