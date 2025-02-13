import express from "express";
import { MercadoPagoConfig } from 'mercadopago';
import { nanoid } from "nanoid";
import Entry from './models/Entry.js';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { Buffer } from 'buffer';

const router = express.Router();

const token = process.env.MERCADOPAGO_TOKEN;
const client = new MercadoPagoConfig({ accessToken: token });

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'imperiotickets@gmail.com', 
    pass: 'kpui dbjk dubd ljuj' 
  }
});

// Generar código QR
const generateQRCodeBase64 = async (id) => {
  try {
    return await QRCode.toDataURL(id, { scale: 5 });
  } catch (error) {
    console.error('Error generando QR:', error);
    throw error;
  }
};

// Generar PDF con QR
const generatePDFWithQR = (qrBase64) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [100, 150] });

  pdf.addImage(qrBase64, "PNG", 30, 100, 40, 40);
  return Buffer.from(pdf.output('arraybuffer')).toString('base64');
};

// Ruta del Webhook
router.post("/", express.json(), async (req, res) => {
  const paymentId = req.query.id;

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${client.accessToken}` }
    });

    if (!response.ok) throw new Error("Error obteniendo datos de pago");
    const data = await response.json();
    const quantity = parseInt(data.additional_info.items[0].quantity);
    const mailAttachments = [];

    for (let i = 0; i < quantity; i++) {
      const entryId = nanoid();
      const qrBase64 = await generateQRCodeBase64(entryId);
      const pdfBase64 = generatePDFWithQR(qrBase64);

      const entry = new Entry({ email: 'brunoosella08@gmail.com', entryId, status: 'pending' });
      await entry.save();

      mailAttachments.push({ filename: `entrada_${paymentId}_${i + 1}.pdf`, content: pdfBase64, encoding: 'base64' });
    }

    await transporter.sendMail({
      from: 'imperiotickets@gmail.com',
      to: 'brunoosella08@gmail.com',
      subject: 'Entradas adjuntas',
      text: 'ESTÁN LISTAS TUS ENTADAS',
      attachments: mailAttachments
    });

    console.log("Correo enviado exitosamente");
    res.status(200).send("Webhook procesado y correo enviado");

  } catch (error) {
    console.error('Error procesando el webhook:', error);
    res.status(500).send("Error procesando el webhook");
  }
});

export default router;
