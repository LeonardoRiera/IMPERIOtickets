import express from "express";
import { nanoid } from "nanoid";
import fetch from "node-fetch";
import nodemailer from "nodemailer";
import { Buffer } from "buffer";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { db } from "../src/services/firebaseConfing.js";
import { doc, getDoc } from "firebase/firestore";

const app = express();
app.use(express.json());

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const paymentId = req.query.id;
  if (!paymentId) {
    return res.status(400).json({ error: "Falta el paymentId" });
  }

  let email = "";
  try {
    const docRef = doc(db, "emails", paymentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("No se encontró un email para este pago");
    }

    email = docSnap.data().email;
    console.log("Email leído con éxito:", email);
  } catch (error) {
    console.error("Error obteniendo el email:", error);
    return res.status(400).json({ error: "No se encontró un email" });
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}` },
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Error al obtener información del pago" });
    }

    const data = await response.json();
    const quantity = parseInt(data.additional_info.items[0].quantity);
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "imperiotickets@gmail.com",
        pass: "kpui dbjk dubd ljuj",
      },
    });

    const generateQRCodeBase64 = async (id) => {
      return await QRCode.toDataURL(id, { scale: 5 });
    };

    const generatePDFWithQR = (qrBase64) => {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 150] });
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("¡Tu entrada para el evento!", 50, 50, { align: "center" });
      pdf.addImage(qrBase64, "PNG", 30, 100, 40, 40);
      return Buffer.from(pdf.output("arraybuffer")).toString("base64");
    };

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

    const mailOptions = {
      from: "imperiotickets@gmail.com",
      to: email,
      subject: "Entradas adjuntas",
      text: "ESTÁN LISTAS TUS ENTRADAS",
      attachments: mailAttachments,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente a:", email);

    res.status(200).send("Webhook procesado y correo enviado");
  } catch (error) {
    console.error("Error en el webhook:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
