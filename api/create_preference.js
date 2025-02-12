import { MercadoPagoConfig, Preference } from 'mercadopago';

import express from "express";
import cors from "cors";

const app = express()
app.use(cors())

const token = import.meta.env.MERCADOPAGO_TOKEN

const client = new MercadoPagoConfig({
  accessToken: token,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://imperiotickets.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Manejo de preflight request
  }

  if (req.method === 'POST') {
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
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
