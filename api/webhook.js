import nodemailer from "nodemailer";
import { nanoid } from "nanoid";
import fetch from "node-fetch";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Buffer } from "buffer";
import fs from 'fs'

export default async function handler(req, res) {

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

  const fetchImageAsBase64 = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al obtener la imagen: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    return `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`; // Prefijo importante
  };

    const logoUrl = fetchImageAsBase64("https://imperiotickets.com/assets/imagotipoLetraNegra.png")
    // const logoUrl = toBase64('https://imperiotickets.com/assets/imagologoTickets-D6SFtBSe.png')
    pdf.addImage(logoUrl, "PNG", 10, 10, 80, 30);

    // Título del ticket
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("¡Tu entrada para el evento!", 50, 50, { align: "center" });

      // Información del evento
      const now = new Date();
      const horaActual = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

      pdf.setFontSize(12);
      pdf.text("Fecha: 15 de Febrero 2025", 10, 70);
      pdf.text(`Hora: ${horaActual}`, 10, 80);
      pdf.text("Ubicación: Teatro Central", 10, 90);
      pdf.text('Tu Id de entrada es: sdasdasdsda', 10, 100)
      pdf.addImage(qrBase64, "PNG", 30, 110, 40, 40);
    
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    return pdfBuffer.toString('base64');
  };




  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const paymentId = req.query.id;
  if (!paymentId) {
    return res.status(400).json({ error: "Falta el paymentId" });
  }

  try {

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}` },
    });

    if (!response.ok) {
      return res.status(500).send("Error al obtener información del pago");
    }

    if(response.ok) {

      const data = await response.json();
      console.log(data.external_reference)
      const emailUser = await data.external_reference
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
  
      res.status(200).send("Webhook procesado y correo enviado");

    }


  } catch (error) {
    console.error("Error en el webhook:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
