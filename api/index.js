import express from "express";
import cors from "cors";
import fs from "fs"
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { Buffer } from 'buffer';
import mongoose from "mongoose";
import { nanoid } from "nanoid";
// import { getEmail, clearEmail, saveEmail } from "./store-email.js";
// import Entry from './models/Entry.js'
// import webhookRouter from "./webhook.js";


dotenv.config();
const token = process.env.MERCADOPAGO_TOKEN
const client = new MercadoPagoConfig({ accessToken: token});
const app = express();
const port = 5100;

app.use(cors());

app.use(express.json({ limit: '50mb' }));

// Configuración de Nodemailer con contraseña de aplicación
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'imperiotickets@gmail.com', 
    pass: 'kpui dbjk dubd ljuj' 
  }
});

  // storeEmail.js
  let storedEmail = null;

  const saveEmail = (email) => {
    storedEmail = email;
  };
  
  const getEmail = () => storedEmail;
  
  const clearEmail = () => {
    storedEmail = null;
  };

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

  const logoUrl = toBase64("dist/assets/imagotipoLetraNegra.png")
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

// Codigo del server
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
        success: `${process.env.VITE_API_URL}Success`,
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

app.post("/store-email", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email es requerido" });
  }

  saveEmail(email);
  console.log("Email guardado:", email);
  res.json({ success: true, message: "Email almacenado correctamente" });
});

app.post("/webhook", express.json(), async (req, res) => {

  const paymentId = req.query.id
  const recipientEmail = getEmail()

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

      // Generar ID, QR y PDF, luego enviar el correo
      try {

        for (let i = 0; i < quantity; i++) {

          // Generar un id
          const entryId = nanoid()

          // QR
          const qrBase64 = await generateQRCodeBase64(entryId);

          // PDF
          const pdfBase64 = generatePDFWithQR(qrBase64);

          // Posteo en base de mongodb
          // const entry = new Entry({
          //   email: 'brunoosella08@gmail.com',
          //   entryId: entryId,
          //   status: 'pending'
          // });
          // await entry.save();

          // Generación de cantidad de entradas
          mailAttachments.push({
            filename: `entrada_${paymentId}_${i + 1}.pdf`,
            content: pdfBase64,
            encoding: 'base64'
          });
        }

        // Configura el correo
        const mailOptions = {
          from: 'imperiotickets@gmail.com', 
          to: recipientEmail,
          subject: 'Entradas adjuntas',
          text: 'ESTÁN LISTAS TUS ENTADAS',
          attachments: mailAttachments
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);
        console.log("Correo enviado exitosamente");

        res.status(200).send("Webhook procesado y correo enviado");
        clearEmail()
      } catch (error) {
        clearEmail()
        console.error('Error procesando el webhook:', error);
        res.status(500).send("Error procesando el webhook");
      }
    }
    
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
    clearEmail()
  }

});


const bootstrap = async () => {

  // await mongoose.connect(process.env.API_URL_MONGODB)

  app.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto ${port}`);
  });
}

bootstrap()