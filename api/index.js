import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { Buffer } from 'buffer';
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import Entry from './models/Entry.js'

dotenv.config();
const token = process.env.MERCADOPAGO_TOKEN
const client = new MercadoPagoConfig({ accessToken: token});
const app = express();
const port = 5000;

app.use(cors({
  origin: "https://imperiotickets.com",
  methods: "GET,POST,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json({ limit: '50mb' }));

let lastPayment = null;

// Configuración de Nodemailer con contraseña de aplicación
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'imperiotickets@gmail.com', 
    pass: 'kpui dbjk dubd ljuj' 
  }
});

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
  const pdf = new jsPDF();
  pdf.text("Tu entrada para el evento!", 10, 20);
  pdf.addImage(qrBase64, 'PNG', 10, 15, 15, 15);
  
  const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
  return pdfBuffer.toString('base64');
};

app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "ARS"
        }
      ],
      back_urls: {
        success: "http://localhost:5173/Success",
        failure: "https://www.youtube.com/watch?v=vEXwN9-tKcs&t=180s&ab_channel=onthecode",
        pending: "https://www.youtube.com/watch?v=vEXwN9-tKcs&t=180s&ab_channel=onthecode"
      },
      auto_return: "approved",
      notification_url: process.env.WEBHOOK_MP
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({
      id: result.id
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al crear la preferencia"
    });
  }
});

app.post("/webhook", express.json(), async (req, res) => {

  const paymentId = req.query.id

  try {
    
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${client.accessToken}`
        }
      }
    )

    if (response.ok) {
      const data = await response.json()

      const quantity = parseInt(data.additional_info.items[0].quantity)
      const mailAttachments = []

      // Generar QR y PDF, luego enviar el correo
      try {

        for (let i = 0; i < quantity; i++) {

          const entryId = nanoid()
          console.log(entryId)
          const qrBase64 = await generateQRCodeBase64(entryId); // Generar QR
          const pdfBase64 = generatePDFWithQR(qrBase64); // Generar PDF

          const entry = new Entry({
            email: 'brunoosella08@gmail.com',
            entryId: entryId,
            status: 'pending'  // Se guarda con estado pendiente por defecto
          });
          await entry.save();

          mailAttachments.push({
            filename: `entrada_${paymentId}_${i + 1}.pdf`,
            content: pdfBase64,
            encoding: 'base64'
          });
        }

        // Configura el correo
        const mailOptions = {
          from: 'imperiotickets@gmail.com', 
          to: 'brunoosella08@gmail.com',
          subject: 'Entradas adjuntas',
          text: `Tu ID de entrada es: ${paymentId}`,
          attachments: mailAttachments
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);
        console.log("Correo enviado exitosamente");

        res.status(200).send("Webhook procesado y correo enviado");

      } catch (error) {
        console.error('Error procesando el webhook:', error);
        res.status(500).send("Error procesando el webhook");
      }
    }
    
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }

});

app.get("/last_payment", (req, res) => {
  if (lastPayment) {
    res.json(lastPayment);
  } else {
    res.status(404).json({ error: "No hay pagos registrados aún." });
  }
});

const bootstrap = async () => {

  await mongoose.connect(process.env.API_URL_MONGODB)

  app.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto ${port}`);
  });
}

bootstrap()