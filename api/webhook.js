// webhook.js
import express from "express";
import cookie from "cookie";
import { nanoid } from "nanoid";
import fetch from "node-fetch";
import nodemailer from 'nodemailer';
import { Buffer } from 'buffer';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import fs from "fs";

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

  const toBase64 = (filePath) => {
    const image = fs.readFileSync(filePath);
    return `data:image/png;base64,${image.toString("base64")}`;
  };

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
    const logoUrl = toBase64("dist/assets/imagotipoLetraNegra.png");
    pdf.addImage(logoUrl, "PNG", 10, 10, 80, 30);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("¡Tu entrada para el evento!", 50, 50, { align: "center" });
    const now = new Date();
    pdf.setFontSize(12);
    pdf.text("Fecha: 15 de Febrero 2025", 10, 70);
    pdf.text(`Hora: ${now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`, 10, 80);
    pdf.text("Ubicación: Teatro Central", 10, 90);
    pdf.addImage(qrBase64, "PNG", 30, 100, 40, 40);
    return Buffer.from(pdf.output('arraybuffer')).toString('base64');
  };

  if (req.method === "POST") {
    const paymentId = req.query.id;
    let email = "";

    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      email = cookies.storedEmail;
      if (!email) {
        throw new Error("No se encontró un email almacenado");
      }
      console.log('Email leído con éxito:', email);
    } catch (error) {
      console.error("Error leyendo el email:", error);
      return res.status(400).json({ error: "No se encontró un email" });
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
      res.sendStatus(500);
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
