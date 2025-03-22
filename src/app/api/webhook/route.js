export const dynamic = 'force-dynamic';

const QRCode = await import("qrcode");
const { nanoid } = await import("nanoid");
const { Buffer } = await import("buffer");
const fs = await import("fs");
const path = await import("path");
const nodemailer = await import("nodemailer");

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function POST(req) {
  const body = await req.json();
  const paymentId = body.data?.id;

  if (!paymentId) {
    return new Response("Falta el paymentId", {
      status: 400,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Responder inmediatamente con "OK" para evitar reintentos
  const response = new Response("OK", {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });

  // Procesar la notificación en segundo plano
  new Promise(async (resolve) => {
    try {
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}` },
      });

      if (!paymentResponse.ok) {
        console.error("Error al obtener pago");
        return;
      }

      const data = await paymentResponse.json();
      const emailUser = data.external_reference;
      const quantity = parseInt(data.additional_info.items[0].quantity);
      const mailAttachments = [];

      for (let i = 0; i < quantity; i++) {
        const entryId = nanoid();
        const qrBase64 = await QRCode.toDataURL(entryId, { scale: 5 });
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
    } catch (error) {
      console.error("Error en el webhook:", error);
    }
    resolve();
  });

  return response;
}

// Función para generar el PDF con el QR
async function generatePDFWithQR(qrBase64) {
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