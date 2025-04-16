import { Payment, MercadoPagoConfig } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_TOKEN });

export async function POST(request) {
  try {
    const reqData = await request.json();

    if (reqData?.data?.id) {

      const { id } = reqData.data;
      const paymentResponse = await new Payment(client).get({ id });

      if (paymentResponse.status === 'approved' && id) {

        const body = {
          external_reference: JSON.parse(paymentResponse.external_reference),
          id: id
        }
  
        // Enviar los datos al endpoint send-email
        await fetch(`${process.env.NEXT_PUBLIC_API_URL_SERVER}send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).catch((error) => console.error("Error al enviar a la info al email:", error));
      }

    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error en el webhook:", error);
    return new Response(null, { status: 200 });
  }
}
