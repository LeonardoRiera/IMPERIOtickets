import { MercadoPagoConfig, Preference } from 'mercadopago';

const token = process.env.MERCADOPAGO_TOKEN;

const client = new MercadoPagoConfig({
  accessToken: token,
});

export async function POST(req) {

  try {
    const bodyData = await req.json(); // Obtener el JSON del request

    const body = {
      items: [
        {
          title: bodyData.title,
          quantity: Number(bodyData.quantity),
          unit_price: Number(bodyData.price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_API_URL}Success`,
        failure: `${process.env.NEXT_PUBLIC_API_URL}Failure`,
        pending: "https://www.youtube.com/watch?v=vEXwN9-tKcs&t=180s&ab_channel=onthecode",
      },
      auto_return: "approved",
      notification_url: process.env.WEBHOOK_MP,
      external_reference: bodyData.external_reference,
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    return Response.json({ id: result.id }, {status: 200, headers:{"Content-Type": "application/json"}});
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error al crear la preferencia" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
