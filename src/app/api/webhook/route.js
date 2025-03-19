export const dynamic = 'force-dynamic';

const QRCode = await import("qrcode");
const { nanoid } = await import("nanoid");
const { Buffer } = await import("buffer");
const fs = await import("fs");
const path = await import("path");
const nodemailer = await import("nodemailer")

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';


export async function POST(req) {
  // Función para convertir una imagen a base64
  const toBase64 = (filePath) => {
    const image = fs.readFileSync(filePath);
    return `data:image/png;base64,${image.toString("base64")}`;
  };

  // Función para generar el QR en base64
  const generateQRCodeBase64 = async (id) => {
    try {
      const qrBase64 = await QRCode.toDataURL(id, { scale: 5 });
      return qrBase64;
    } catch (error) {
      console.error("Error generando QR:", error);
      throw error;
    }
  };

  // Función para generar el PDF con el QR
  const generatePDFWithQR = async (qrBase64) => {
    // Crear un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([60, 150]); // Tamaño personalizado
  
    // Cargar una fuente estándar
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
    // Convertir la imagen base64 a un objeto de imagen
    const qrImage = await pdfDoc.embedPng(qrBase64);
  
    // Agregar el logo (si es necesario)
    const imagePath = path.join(process.cwd(), "public", "assets", "imagotipoLetraNegra.png");
    const logoImage = await pdfDoc.embedPng(fs.readFileSync(imagePath));
  
    // Dibujar el logo en el PDF
    page.drawImage(logoImage, {
      x: 10,
      y: 110,
      width: 80,
      height: 30,
    });
  
    // Dibujar el texto en el PDF
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
  
    // Dibujar el QR en el PDF
    page.drawImage(qrImage, {
      x: 30,
      y: 10,
      width: 60,
      height: 40,
    });
  
    // Guardar el PDF como base64
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes).toString('base64');
  };

  const body = await req.json(); // Parsea el body de la solicitud
  const paymentId = body.data?.id;

  if (!paymentId) {
    return new Response(JSON.stringify({ error: "Falta el paymentId" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}` },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Error al obtener información del pago" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const emailUser = data.external_reference;
    const quantity = parseInt(data.additional_info.items[0].quantity);
    const mailAttachments = [];

    for (let i = 0; i < quantity; i++) {
      const entryId = nanoid();
      const qrBase64 = await generateQRCodeBase64(entryId);
      const pdfBase64 = await generatePDFWithQR(qrBase64);
      mailAttachments.push({
        filename: `entrada_${paymentId}_${i + 1}.pdf`,
        content: pdfBase64,
        encoding: "base64",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "imperiotickets@gmail.com",
        pass: "kpui dbjk dubd ljuj",
      },
    });

    const mailOptions = {
      from: "imperiotickets@gmail.com",
      to: emailUser,
      subject: "Entradas adjuntas",
      text: "Aquí están tus entradas.",
      attachments: mailAttachments,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente");

    return new Response(JSON.stringify({ message: "Webhook procesado y correo enviado" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error en el webhook:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}