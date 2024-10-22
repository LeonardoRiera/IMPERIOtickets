import React, { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from 'axios';

const MercadoPagoHandler = ({ onPreferenceIdReady, count, subTotal, image, title  }) => {
  console.log("necesito rastrear")
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    console.log("Inicializando Mercado Pago...");
    initMercadoPago("APP_USR-ba58586c-b64d-423f-b0cf-f36b53fe8838", {
      locale: "es-AR",
    });
    console.log("Mercado Pago inicializado.");
  }, []);

 const createPreference = async () => {
  console.log("Creando preferencia...");
  try {
    console.log({ title, count, subTotal, image });
    const response = await axios.post("http://147.79.107.178:3000/create_preference", {
      items: [{  // Asegúrate de que los datos estén dentro de items
        title: title,
        quantity: count,
        unit_price: subTotal,  // Cambiar a unit_price
        picture_url: image
      }],
      back_urls: {
        success: 'http://147.79.107.178/success',
        failure: 'http://147.79.107.178/failure',
        pending: 'http://147.79.107.178/pending'
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 6
      },
      external_reference: 'mi-referencia-external-12345'
    });
    

    console.log("Respuesta del servidor:", response.data);
    const { id } = response.data;
    console.log("ID de la preferencia recibida:", id);
    return id;
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
  }
};



  const handleBuy = async () => {
    console.log("Botón 'Comprar' clicado.");
    const id = await createPreference();
    
    if (id) {
      console.log("Estableciendo ID de la preferencia en el estado:", id);
      setPreferenceId(id);
      if (onPreferenceIdReady) onPreferenceIdReady(id); // Pasar el ID al componente padre si es necesario
    } else {
      console.warn("No se pudo obtener el ID de la preferencia.");
    }
  };


  return (
    <div>
      <button onClick={handleBuy} className='botonComprarEntrada2' >Pagar</button>
      <div id="wallet_container"></div>
      {preferenceId && (<Wallet initialization={{ preferenceId: preferenceId }} />
      )}
    </div>
  );
};

export default MercadoPagoHandler;