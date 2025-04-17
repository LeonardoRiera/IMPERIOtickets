'use client'
import React from 'react';
import './Button.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { v4 as uuidv4 } from 'uuid';
import mercadoPagoService from '../../services/mercado.pago.service';

const Button = ({ count, subTotal, title, email, price }) => {
  const [preference, setPreference] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const initiated = React.useRef(false);

  const publicKey = process.env.NEXT_PUBLIC_KEY_MERCADOPAGO;

  React.useEffect(() => {
    initMercadoPago(publicKey, { locale: 'es-AR' });
    payment()
  }, [publicKey]); 

  const payment = async () => {
    if (isLoading || initiated.current) return;
    setIsLoading(true);
    initiated.current = true;

    try {

      const ticketId = uuidv4()
      console.log(ticketId)
      const body = {
        title: title,
        quantity: count,
        price: price,
        external_reference: {email, count, ticketId}
      };

      const response = await mercadoPagoService(body);
      setPreference(response.id);
    } catch (error) {
      console.error("Error al crear preferencia:", error);
    } finally {
      setTimeout(() =>{
        setIsLoading(false);
      }, 0)
    }
  };

  return (
      <>
      {isLoading && <div className='loader-button'></div>}
      {preference && !isLoading && <Wallet initialization={{ preferenceId: preference }} />}
      </>
  );
};

export default Button;