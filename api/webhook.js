import { db } from "../src/services/firebaseConfing.js";
import { doc, getDoc } from "firebase/firestore";
import nodemailer from "nodemailer";
import { nanoid } from "nanoid";
import fetch from "node-fetch";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Buffer } from "buffer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const paymentId = req.query.id;
  if (!paymentId) {
    return res.status(400).json({ error: "Falta el paymentId" });
  }

  try {
    // **1. Obtener el email correcto de Firestore**
    const docRef = doc(db, "emails", paymentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("No se encontró un email para este paymentId");
    }

    const email = docSnap.data().email;
    console.log("Email encontrado:", email);

    // **2. Obtener la información del pago en MercadoPago**
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}` },
    });

    if (!response.ok) {
      return res.status(500).send("Error al obtener información del pago");
    }

    const data = await response.json();
    const quantity = parseInt(data.additional_info.items[0].quantity);
    const mailAttachments = [];

    for (let i = 0; i < quantity; i++) {
      const entryId = nanoid();
      const qrBase64 = await QRCode.toDataURL(entryId, { scale: 5 });

      const pdf = new jsPDF();
      pdf.text("Tu entrada", 10, 10);
      pdf.addImage(qrBase64, "PNG", 50, 20, 40, 40);
      const pdfBase64 = Buffer.from(pdf.output("arraybuffer")).toString("base64");

      mailAttachments.push({
        filename: `entrada_${paymentId}_${i + 1}.pdf`,
        content: pdfBase64,
        encoding: "base64",
      });
    }

    // **3. Enviar el correo**
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "imperiotickets@gmail.com",
        pass: "kpui dbjk dubd ljuj",
      },
    });

    const mailOptions = {
      from: "imperiotickets@gmail.com",
      to: email,
      subject: "Entradas adjuntas",
      text: "Aquí están tus entradas.",
      attachments: mailAttachments,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente");

    res.status(200).send("Webhook procesado y correo enviado");

  } catch (error) {
    console.error("Error en el webhook:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
