// import nodemailer from "nodemailer";
// import { nanoid } from "nanoid";
// import QRCode from "qrcode";
// import { jsPDF } from "jspdf";
// import { Buffer } from "buffer";
// import fs from "fs";
// import path from "path";

export const dynamic = 'force-dynamic';

const QRCode = await import("qrcode");
const { nanoid } = await import("nanoid");
const { Buffer } = await import("buffer");
const fs = await import("fs");
const path = await import("path");
const nodemailer = await import("nodemailer")


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
    // Only import jsPDF at runtime when this function is called
    const { jsPDF } = await import("jspdf");
    
    const pdf = new jsPDF({
      orientation: "portait",
      unit: "mm",
      format: [100, 150],
    });

    // Obtener la ruta absoluta de la imagen
    const imagePath = path.join(process.cwd(), "public", "assets", "imagotipoLetraNegra.png");
    const logoUrl = toBase64(imagePath);

    // Agregar la imagen al PDF
    pdf.addImage(logoUrl, "PNG", 10, 10, 80, 30);

    // Título del ticket
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("¡Tu entrada para el evento!", 50, 50, { align: "center" });

    // Información del evento
    pdf.setFontSize(12);
    pdf.text("Fecha: 1 de Marzo de 2025", 10, 70);
    pdf.text("Hora: 21hs.", 10, 80);
    pdf.text("Ubicación: Galpón Blanco - El Andino", 10, 90);
    pdf.text("Tu Id de entrada es: ", 10, 100);
    pdf.addImage(qrBase64, "PNG", 30, 110, 40, 40);

    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
    return pdfBuffer.toString("base64");
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