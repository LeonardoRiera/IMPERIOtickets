import { MercadoPagoConfig } from 'mercadopago';
import Entry from './models/Entry.js';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { Buffer } from 'buffer';
// import mongoose from "mongoose";
import { nanoid } from "nanoid";

const token = process.env.MERCADOPAGO_TOKEN;
const client = new MercadoPagoConfig({ accessToken: token });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const paymentId = req.query.id;

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${client.accessToken}` }
    });

    if (!response.ok) {
      return res.status(400).json({ error: 'Error al obtener el pago' });
    }

    const data = await response.json();
    const quantity = parseInt(data.additional_info.items[0].quantity);
    const mailAttachments = [];

    for (let i = 0; i < quantity; i++) {
      const entryId = nanoid();
      const qrBase64 = await QRCode.toDataURL(entryId, { scale: 5 });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [100, 150] });
      pdf.addImage(qrBase64, "PNG", 30, 100, 40, 40);
      const pdfBase64 = Buffer.from(pdf.output('arraybuffer')).toString('base64');

      const entry = new Entry({ email: 'brunoosella08@gmail.com', entryId, status: 'pending' });
      await entry.save();

      mailAttachments.push({
        filename: `entrada_${paymentId}_${i + 1}.pdf`,
        content: pdfBase64,
        encoding: 'base64'
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: 'imperiotickets@gmail.com', pass:'kpui dbjk dubd ljuj'}
    });

    await transporter.sendMail({
      from: 'imperiotickets@gmail.com',
      to: 'brunoosella08@gmail.com',
      subject: 'Entradas adjuntas',
      text: 'ESTÁN LISTAS TUS ENTRADAS',
      attachments: mailAttachments
    });

    return res.status(200).json({ message: 'Webhook procesado y correo enviado' });

  } catch (error) {
    console.error('Error procesando el webhook:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}
