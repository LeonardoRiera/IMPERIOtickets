import nodemailer from "nodemailer";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Buffer } from "buffer";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return new Response(JSON.stringify({ error: "Falta el paymentId" }), { status: 400 });
    }

    // Obtener la info del pago desde MercadoPago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}` },
    });

    if (!response.ok) {
      return new Response("Error al obtener información del pago", { status: 500 });
    }

    const data = await response.json();
    const emailUser = data.external_reference;
    const quantity = parseInt(data.additional_info.items[0].quantity);

    const mailAttachments = [];

    for (let i = 0; i < quantity; i++) {
      const entryId = nanoid();
      const qrBase64 = await QRCode.toDataURL(entryId, { scale: 5 });

      const pdfBase64 = generatePDFWithQR(qrBase64);
      mailAttachments.push({
        filename: `entrada_${paymentId}_${i + 1}.pdf`,
        content: pdfBase64,
        encoding: "base64",
      });
    }

    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar correo
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailUser,
      subject: "Entradas adjuntas",
      text: "Aquí están tus entradas.",
      attachments: mailAttachments,
    });

    console.log("Correo enviado exitosamente");
    return new Response("Webhook procesado y correo enviado", { status: 200 });
  } catch (error) {
    console.error("Error en el webhook:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}

// Función para generar el PDF con QR
function generatePDFWithQR(qrBase64) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 150] });

  // Cargar la imagen del logo
  const imagePath = path.join(process.cwd(), "public", "assets", "imagotipoLetraNegra.png");
  const logoUrl = toBase64(imagePath);
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
  pdf.text("Tu Id de entrada es:", 10, 100);
  pdf.addImage(qrBase64, "PNG", 30, 110, 40, 40);

  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
  return pdfBuffer.toString("base64");
}

// Función para convertir imagen a Base64
function toBase64(filePath) {
  const image = fs.readFileSync(filePath);
  return `data:image/png;base64,${image.toString("base64")}`;
}
