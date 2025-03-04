/* import { MercadoPagoConfig, Preference } from 'mercadopago';
import express from "express";
import cors from "cors";

const app = express()

app.use(cors())

const token = process.env.MERCADOPAGO_TOKEN

const client = new MercadoPagoConfig({
  accessToken: token,
});

export default async function handler(req, res) {

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
          failure: `${process.env.VITE_API_URL}Failure`,
          pending: "https://www.youtube.com/watch?v=vEXwN9-tKcs&t=180s&ab_channel=onthecode"
        },
        auto_return: "approved",
        notification_url: process.env.WEBHOOK_MP,
        external_reference: req.body.external_reference
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
 */