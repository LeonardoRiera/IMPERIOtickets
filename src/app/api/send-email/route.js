import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

import mongoose from 'mongoose';
import Payment from '../../models/Payment';

import { NextResponse } from "next/server";

const allowedIPs = new Set([
  "54.88.218.97",
  "18.215.140.160",
  "18.213.114.129",
  "18.206.34.84",
  "35.236.253.169",
  "35.245.91.34",
  "35.245.20.104",
  "35.186.182.146",
]);

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.API_URL_MONGODB);
}

export async function POST(request) {

  const ip = request.headers.get("x-forwarded-for") || request.ip;

  if (!allowedIPs.has(ip)) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  const reqData = await request.json();

  await connectDB();

  try {

    if(reqData.data.id) {

      const { data } = reqData
      const { id } = data
      const payment_id = id

      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
        headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}` }
      });

      const response = await paymentResponse.json()

      if(response.status === 'approved') {

        console.log(response)

        const parsedData = JSON.parse(response.external_reference);
        const email = parsedData.email;
        const quantity = parseInt(response.additional_info.items[0].quantity);        
        const status = 'approved'
        
        const existingPayment = await Payment.findOne({ payment_id });
        
        if (existingPayment) {
          return new NextResponse(
            JSON.stringify({ success: false, message: 'El pago ya fue procesado' }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        // Crear un nuevo pago en la base de datos
        const newPayment = new Payment({
          payment_id,
          email,
          count: parseInt(quantity, 10),
          status,
        });

        
        // Guardar el pago en la base de datos
        await newPayment.save();
        
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

      }

      return NextResponse.json({ message: "Notificación recibida correctamente" }, { status: 200 });

    } else {

      return NextResponse.json({ message: "Notificación recibida correctamente PERO LA PORONGA DE MERCADOPAGO ALGO HIZO MAL" }, { status: 200 });
    }

    return NextResponse.json({ message: "Notificación recibida correctamente" }, { status: 200 });


  } catch (error) {

    console.log(error)
    return new Response(JSON.stringify({ success: false, message: error }), {status: 500});

  }
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