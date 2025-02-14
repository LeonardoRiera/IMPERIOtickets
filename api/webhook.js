import express from "express";
import { nanoid } from "nanoid";
import fetch from "node-fetch";
import nodemailer from 'nodemailer';
import { Buffer } from 'buffer';
import { jsPDF } from 'jspdf';
import fs from "fs"
import QRCode from 'qrcode';


const app = express();
app.use(express.json());

export default async function handler(req, res) {
// Configuración de Nodemailer con contraseña de aplicación
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
  
  // Función para generar el QR en base64
  const generateQRCodeBase64 = async (id) => {
    try {
      const qrBase64 = await QRCode.toDataURL(id, { scale: 5 });
      return qrBase64;
    } catch (error) {
      console.error('Error generando QR:', error);
      throw error;
    }
  };
  
  // Función para generar el PDF con el QR
  const generatePDFWithQR = (qrBase64) => {
    const pdf = new jsPDF({
      orientation:'portait',
      unit: 'mm',
      format:[100, 150]
    });
  
    const logoUrl = toBase64('../IMPERIOtickets/src/assets/imagologoTickets.png')
    // const logoUrl = toBase64('https://imperiotickets.com/assets/imagologoTickets-D6SFtBSe.png')
    pdf.addImage(logoUrl, "PNG", 35, 10, 30, 30);
  
    // Título del ticket
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("¡Tu entrada para el evento!", 50, 50, { align: "center" });
  
    // Información del evento
    pdf.setFontSize(12);
    pdf.text("Fecha: 15 de Febrero 2025", 10, 70);
    pdf.text("Hora: 20:00", 10, 80);
    pdf.text("Ubicación: Teatro Central", 10, 90);
  
    pdf.addImage(qrBase64, "PNG", 30, 100, 40, 40);
    
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    return pdfBuffer.toString('base64');
  };

  if (req.method === "POST") {
    const paymentId = req.query.id;

    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const quantity = parseInt(data.additional_info.items[0].quantity);
        const mailAttachments = [];

        try {
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
            to: "brunoosella08@gmail.com",
            subject: "Entradas adjuntas",
            text: "ESTÁN LISTAS TUS ENTADAS",
            attachments: mailAttachments,
          };

          await transporter.sendMail(mailOptions);
          console.log("Correo enviado exitosamente");

          res.status(200).send("Webhook procesado y correo enviado");
        } catch (error) {
          console.error("Error procesando el webhook:", error);
          res.status(500).send("Error procesando el webhook");
        }
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
