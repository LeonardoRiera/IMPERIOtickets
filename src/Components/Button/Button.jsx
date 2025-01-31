import React from 'react';
import '../Button/Button.css'; 
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'

import mercadoPagoService from '../../services/mercado.pago.service';

const Button = ({ count, subTotal, title }) => {

  const [preference, setPreference] = React.useState(null)

  const publicKey = 'APP_USR-c4167a16-3c8f-41b4-8391-0d4aefb8f04c' // test always
  // const publicKey = 'APP_USR-b18a6e16-2c43-4069-aeab-2dcb60c3a7e2'

  React.useEffect(() => {

    initMercadoPago(publicKey, {locale:'es-AR'});

    payment()

  }, [])

  const payment = async () => {

    const body = {
      title: title,
      quantity: count,
      price: subTotal

    }

    const response = await mercadoPagoService(body)

    console.log(response)
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