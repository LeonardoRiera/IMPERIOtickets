'use client'
import React, { Suspense } from 'react';
import './VentaFinal.css'
import { useSearchParams } from 'next/navigation';
import Button from '../../Components/Button/Button';

const ParamsComponent = () => {
  const searchParams = useSearchParams();
  const params = {
    imageDetail: searchParams.get('imageDetail') || '',
    title: searchParams.get('title') || '',
    price: searchParams.get('price') || '',
    count: searchParams.get('count') || '',
    email: searchParams.get('email') || ''
  };

  return (
    <div className='factura'>
      <h1 className='finalTitulo'>Confirma los datos antes de finalizar la compra</h1>
      <p className='dataFinalSubT'>Tu entrada será enviada al siguiente correo:</p>
      <p className='dataFinalMail'>{params.email}</p>
      <p className='dataFinal'>Cantidad de Entradas: .................... {params.count}</p>
      <p className='dataFinal'>Precio por Entrada: ............................ ${params.price}</p>
      <p className='dataFinalTotal'>Total a pagar: $lo que sea</p>
      <p className='dataFinalInfo'>AL FINALIZAR LA COMPRA ENVIAREMOS TUS ENTRADAS EN FORMATO PDF CON UN CÓDIGO QR ÚNICO A TU MAIL.</p>
      <p className='dataFinalInfo'>Cualquier duda, podes consultar GUIA DE COMPRA.</p>
      <Button count={params.count} subTotal={params.total} title={params.title} className='botonComprarEntrada2' email={params.email} price={params.price}/>
    </div>
  );
};

const VentaFinal = () => {
  return (
    <Suspense fallback={<div>Cargando Venta Final...</div>}>
      <ParamsComponent />
    </Suspense>
  );
};

export default VentaFinal;
