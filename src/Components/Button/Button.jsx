import React from 'react';
import '../Button/Button.css'; 
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'

import mercadoPagoService from '../../services/mercado.pago.service';

const Button = ({ count, subTotal, title }) => {

  const [preference, setPreference] = React.useState(null)

  React.useEffect(() => {

    initMercadoPago('APP_USR-c02273b8-2e33-4e7b-9d57-deb0c7040974', {locale:'es-AR'});

  }, [])

  const payment = async () => {

    const body = {
      title: {title},
      quantity: count,
      price: subTotal

    }

    const response = await mercadoPagoService(body)

    console.log(response)
    setPreference(response.id)

  }

  

  return (
    <>

    <button 
      onClick={payment} 
      // disabled={disabled} 
      // className={className}
    >
      Comprarrr
    </button>
    {
      preference && 
        
      <Wallet initialization={{ preferenceId: preference }} customization={{ texts:{ valueProp: 'smart_option'}}} />
    }


    </>
  );
};

export default Button;