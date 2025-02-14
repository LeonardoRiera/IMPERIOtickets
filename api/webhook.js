import express from "express";
import { nanoid } from "nanoid";
import fetch from "node-fetch";
import nodemailer from 'nodemailer';
import { Buffer } from 'buffer';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { db } from "../src/services/firebaseConfing.js";
import { doc, getDoc } from "firebase/firestore";

const app = express();
app.use(express.json());

export default async function handler(req, res) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'imperiotickets@gmail.com',
      pass: 'kpui dbjk dubd ljuj'
    }
  });

  const generateQRCodeBase64 = async (id) => {
    try {
      return await QRCode.toDataURL(id, { scale: 5 });
    } catch (error) {
      console.error('Error generando QR:', error);
      throw error;
    }
  };

  const generatePDFWithQR = (qrBase64) => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [100, 150] });
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("¡Tu entrada para el evento!", 50, 50, { align: "center" });
    pdf.setFontSize(12);
    pdf.text("Fecha: 15 de Febrero 2025", 10, 70);
    pdf.addImage(qrBase64, "PNG", 30, 100, 40, 40);
    return Buffer.from(pdf.output('arraybuffer')).toString('base64');
  };

  if (req.method === "POST") {
    const { id, paymentId } = req.body;

    if (!id || !paymentId) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    let email = "";
    try {
      // Obtener email desde Firestore con idEmail
      const docRef = doc(db, "emails", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("No se encontró el email en Firestore");
      }

      email = docSnap.data().email;
      console.log('Email leído con éxito:', email);
    } catch (error) {
      console.error("Error obteniendo el email:", error);
      return res.status(400).json({ error: "No se encontró el email" });
    }

    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}` },
      });

      if (response.ok) {
        const data = await response.json();
        const quantity = parseInt(data.additional_info.items[0].quantity);
        const mailAttachments = [];

        for (let i = 0; i < quantity; i++) {
          const entryId = nanoid();
          const qrBase64 = await generateQRCodeBase64(entryId);
          const pdfBase64 = generatePDFWithQR(qrBase64);
          mailAttachments.push({ filename: `entrada_${paymentId}_${i + 1}.pdf`, content: pdfBase64, encoding: "base64" });
        }

        const mailOptions = {
          from: "imperiotickets@gmail.com",
          to: email,
          subject: "Entradas adjuntas",
          text: "ESTÁN LISTAS TUS ENTRADAS",
          attachments: mailAttachments,
        };

        await transporter.sendMail(mailOptions);
        console.log("Correo enviado exitosamente");
        res.status(200).send("Webhook procesado y correo enviado");
      } else {
        res.status(500).send("Error al obtener información del pago");
      }
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
