import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Buffer } from "buffer";
import fs from "fs";
import path from "path";

// Función para convertir una imagen a Base64
const toBase64 = (filePath) => {
  const image = fs.readFileSync(filePath);
  return `data:image/png;base64,${image.toString("base64")}`;
};

// Generar código QR en Base64
const generateQRCodeBase64 = async (id) => {
  try {
    return await QRCode.toDataURL(id, { scale: 5 });
  } catch (error) {
    console.error("Error generando QR:", error);
    throw error;
  }
};

// Generar PDF con QR
const generatePDFWithQR = (qrBase64) => {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 150] });

  // Cargar logo
  const imagePath = path.join(process.cwd(), "public", "assets", "imagotipoLetraNegra.png");
  const logoUrl = toBase64(imagePath);

  pdf.addImage(logoUrl, "PNG", 10, 10, 80, 30);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("¡Tu entrada para el evento!", 50, 50, { align: "center" });

  pdf.setFontSize(12);
  pdf.text("Fecha: 1 de Marzo de 2025", 10, 70);
  pdf.text("Hora: 21hs.", 10, 80);
  pdf.text("Ubicación: Galpón Blanco - El Andino", 10, 90);
  pdf.text("Tu Id de entrada es:", 10, 100);
  pdf.addImage(qrBase64, "PNG", 30, 110, 40, 40);

  return Buffer.from(pdf.output("arraybuffer")).toString("base64");
};

// Handler del webhook
export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("id");
    const topic = searchParams.get("topic");

    if (!paymentId || topic !== "payment") {
      console.log("Notificación ignorada, no es un pago.");
      return NextResponse.json({ message: "Notificación ignorada" }, { status: 200 });
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}` },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Error al obtener información del pago" }, { status: 500 });
    }

    const data = await response.json();

    console.log(data)

    if (data.status !== "approved") {
      console.log(`Pago aún no aprobado: ${data.status}`);
      return NextResponse.json({ message: "Pago aún no aprobado" }, { status: 200 });
    }

    console.log("Pago aprobado, procesando envío de entradas...");
    const emailUser = data.external_reference;
    const quantity = parseInt(data.additional_info.items[0].quantity);

    const mailAttachments = [];

    for (let i = 0; i < quantity; i++) {
      const entryId = nanoid();
      const qrBase64 = await generateQRCodeBase64(entryId);
      const pdfBase64 = generatePDFWithQR(qrBase64);

      mailAttachments.push({
        filename: `entrada_${paymentId}_${i + 1}.pdf`,
        content: pdfBase64,
        encoding: "base64",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailUser,
      subject: "Entradas adjuntas",
      text: "Aquí están tus entradas.",
      attachments: mailAttachments,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente");

    return NextResponse.json({ message: "Webhook procesado y correo enviado" });
  } catch (error) {
    console.error("Error en el webhook:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
