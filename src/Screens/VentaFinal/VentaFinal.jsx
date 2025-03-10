import React from 'react';
import '../VentaFinal/VentaFinal.css'
import { useLocation, Navigate } from 'react-router-dom';
import Button from '../../Components/Button/Button';


const VentaFinal = () => {


  // Este useEffect asegura que la página se desplace hacia arriba al cargar el componente, me encanto!!
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // El array vacío indica que se ejecutará solo al montar el componente


  // Extraemos los parámetros pasados por el Link

  const location = useLocation();

  if (!location.state) {
    // Redirigir a la página de inicio o a otra página si no hay estado
    return <Navigate to="/CardDetail" />;
  }


  const { imageDetail, title, price, count, total, email } = location.state;

  return (
    <div className='factura'>
      <h1 className='finalTitulo'>Confirma los datos antes de finalizar la compra</h1>

      <p className='dataFinalSubT'>Tu entrada será enviada al siguiente correo:</p>

      <p className='dataFinalMail'>{email}</p>

      <p className='dataFinal'>Cantidad de Entradas: .................... {count}</p>

      <p className='dataFinal'>Precio por Entrada: ............................ ${price}</p>

      <p className='dataFinalTotal'>Total a pagar: ${total.toFixed(2)}</p>

      <p className='dataFinalInfo'>AL FINALIZAR LA COMPRA ENVIAREMOS TUS ENTRADAS EN FORMATO PDF CON UN CÓDIGO QR ÚNICO A TU MAIL.</p>

      <p className='dataFinalInfo'>Cualquier duda, podes consultar GUIA DE COMPRA.  </p>

      <Button count={count} subTotal={total} image={imageDetail} title={title} className='botonComprarEntrada2' email={email} price={price}/>
    </div>
  );
};

export default VentaFinal;