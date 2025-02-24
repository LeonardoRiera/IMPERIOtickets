import React from 'react';
import '../Button/Button.css'; 
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import mercadoPagoService from '../../services/mercado.pago.service';


const Button = ({ count, price, title, email }) => {


  // Local states
  const [preference, setPreference] = React.useState(null)

  const publicKey = import.meta.env.VITE_PUBLIC_KEY_MERCADOPAGO

  React.useEffect(() => {

    initMercadoPago(publicKey, {locale:'es-AR'});

    payment()

  }, [])

  const payment = async () => {

    const body = {
      title: title,
      quantity: count,

      price: price,
      external_reference: email

    }

    const response = await mercadoPagoService(body)

    setPreference(response.id)

  }
  

  return (
    <>

    {
      preference && 
        
      <Wallet initialization={{ preferenceId: preference }} />
    }


    </>
  );
};

export default Button;