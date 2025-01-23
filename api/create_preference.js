import { MercadoPagoConfig, Preference } from 'mercadopago';

const token = import.meta.env.ACCESS_TOKEN

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
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success: 'https://www.youtube.com/watch?v=vEXwN9-tKcs&t=180s&ab_channel=onthecode',
          failure: 'https://www.youtube.com/watch?v=vEXwN9-tKcs&t=180s&ab_channel=onthecode',
          pending: 'https://www.youtube.com/watch?v=vEXwN9-tKcs&t=180s&ab_channel=onthecode',
        },
        auto_return: 'approved',
      };

      const preference = new Preference(client);
      const result = await preference.create({ body });

      res.status(200).json({ id: result.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la preferencia' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
