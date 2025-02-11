import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { Buffer } from 'buffer';
import mongoose from "mongoose";

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-7761394088745425-010814-cb1b8f6f85abe80efcc53e46091a219c-2151711431' });
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
dotenv.config();

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
      notification_url:'https://9acf-201-235-103-19.ngrok-free.app/webhook'
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
      console.log(data)

      // Generar QR y PDF, luego enviar el correo
      try {
        const qrBase64 = await generateQRCodeBase64(paymentId);  // Genera el QR en base64
        const pdfBase64 = generatePDFWithQR(qrBase64);     // Genera el PDF en base64

        // Configura el correo
        const mailOptions = {
          from: 'imperiotickets@gmail.com', 
          to: 'brunoosella08@gmail.com', // Cambia por el correo del destinatario
          subject: 'Entradas adjuntas',
          text: `Tu ID de entrada es: ${paymentId}`,
          attachments: [
            {
              filename: `entrada_${paymentId}.pdf`,
              content: pdfBase64,
              encoding: 'base64'
            }
          ]
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

    res.sendStatus(200)

    
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }


  // ESTA ES LA FORMA QUE CONSTRUÍ CON IA Y YO MISMO, LA ANTERIOR ES LA DEL VIDEO EXPLICATIVO, CREO QUE SERÁ MEJOR
  // console.log("Webhook recibido:", req.query);

  // const { id, topic } = req.query;

  // if (!topic || topic !== "payment" || !id) {
  //   console.error("Notificación inválida");
  //   return res.status(400).send("Notificación inválida");
  // }

  // lastPayment = id;

  // // Generar QR y PDF, luego enviar el correo
  // try {
  //   const qrBase64 = await generateQRCodeBase64(id);  // Genera el QR en base64
  //   const pdfBase64 = generatePDFWithQR(qrBase64);     // Genera el PDF en base64

  //   // Configura el correo
  //   const mailOptions = {
  //     from: 'imperiotickets@gmail.com', 
  //     to: 'brunoosella08@gmail.com', // Cambia por el correo del destinatario
  //     subject: 'Entradas adjuntas',
  //     text: `Tu ID de entrada es: ${id}`,
  //     attachments: [
  //       {
  //         filename: `entrada_${id}.pdf`,
  //         content: pdfBase64,
  //         encoding: 'base64'
  //       }
  //     ]
  //   };

  //   // Enviar el correo
  //   await transporter.sendMail(mailOptions);
  //   console.log("Correo enviado exitosamente");

  //   res.status(200).send("Webhook procesado y correo enviado");

  // } catch (error) {
  //   console.error('Error procesando el webhook:', error);
  //   res.status(500).send("Error procesando el webhook");
  // }
});

app.get("/last_payment", (req, res) => {
  if (lastPayment) {
    res.json(lastPayment);
  } else {
    res.status(404).json({ error: "No hay pagos registrados aún." });
  }
});



const bootstrap = async () => {

  await mongoose.connect('mongodb+srv://imperiotickets:imperio123@imperiotickets.tgwtz.mongodb.net/?retryWrites=true&w=majority&appName=ImperioTickets')

  app.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto ${port}`);
  });
}

bootstrap()