'use client'
import React from 'react';
import './Button.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import mercadoPagoService from '../../services/mercado.pago.service';

const Button = ({ count, subTotal, title, email, price }) => {
  const [preference, setPreference] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const initiated = React.useRef(false);

  const publicKey = process.env.NEXT_PUBLIC_KEY_MERCADOPAGO;

  React.useEffect(() => {
    initMercadoPago(publicKey, { locale: 'es-AR' });
  }, [publicKey]); 

  const payment = async () => {
    if (isLoading || initiated.current) return;
    setIsLoading(true);
    initiated.current = true;

    try {
      const body = {
        title: title,
        quantity: count,
        price: 1,
        external_reference: {email, count}
      };

      const response = await mercadoPagoService(body);
      setPreference(response.id);
    } catch (error) {
      console.error("Error al crear preferencia:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={payment}
      disabled={isLoading}
    >
      {isLoading ? 'Procesando...' : 'Pagar con MercadoPago'}
      {preference && <Wallet initialization={{ preferenceId: preference }} />}
    </button>
  );
};

export default Button;