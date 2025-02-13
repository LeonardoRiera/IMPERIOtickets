import { MercadoPagoConfig } from 'mercadopago';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { Buffer } from 'buffer';
import { nanoid } from 'nanoid';

const token = process.env.MERCADOPAGO_TOKEN;
const client = new MercadoPagoConfig({ accessToken: token });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const paymentId = req.query.id;

  try {
    // Responder rápido a Vercel
    res.status(200).json({ message: 'Webhook recibido, procesando en background' });

    // Procesar en segundo plano
    processPayment(paymentId);

  } catch (error) {
    console.error('Error procesando el webhook:', error);
  }
}

async function processPayment(paymentId) {
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${client.accessToken}` },
    });

    if (!response.ok) {
      console.error('Error al obtener el pago');
      return;
    }

    const data = await response.json();
    const quantity = parseInt(data.additional_info.items[0].quantity);
    const mailAttachments = [];

    // Generar QR y PDF en paralelo
    const attachments = await Promise.all(
      Array.from({ length: quantity }, async (_, i) => {
        const entryId = nanoid();
        const qrBase64 = await QRCode.toDataURL(entryId, { scale: 5 });

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [100, 150] });
        pdf.addImage(qrBase64, 'PNG', 30, 100, 40, 40);
        const pdfBase64 = Buffer.from(pdf.output('arraybuffer')).toString('base64');

        return {
          filename: `entrada_${paymentId}_${i + 1}.pdf`,
          content: pdfBase64,
          encoding: 'base64',
        };
      })
    );

    mailAttachments.push(...attachments);

    // Enviar correo
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: 'imperiotickets@gmail.com', pass: 'kpui dbjk dubd ljuj' },
    });

    await transporter.sendMail({
      from: 'imperiotickets@gmail.com',
      to: 'brunoosella08@gmail.com',
      subject: 'Entradas adjuntas',
      text: 'ESTÁN LISTAS TUS ENTRADAS',
      attachments: mailAttachments,
    });

    console.log('Correo enviado con éxito');

  } catch (error) {
    console.error('Error en processPayment:', error);
  }
}
