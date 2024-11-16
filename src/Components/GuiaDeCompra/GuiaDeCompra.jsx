import { useEffect } from 'react';
import '../GuiaDeCompra/GuiaDeCompra.css';

export const GuiaDeCompra = () => {

   // Este useEffect asegura que la página se desplace hacia arriba al cargar el componente, me encanto!!
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // El array vacío indica que se ejecutará solo al montar el componente

  return (
    <div className='guiaDeCompraContainer'>

      {/* Enlaces de navegación */}
      <h2 className='tituloInformacionGuia'>
        <a href="#guiaDeCompra">Guía de Compra</a>  
        <a href="#metodosDePago">Métodos de Pago</a>
        <a href="#terminosCondiciones">Términos y Condiciones</a>
      </h2>
      <h3 id="guiaDeCompra" className='tituloInformacionAdministrativa'>Guía de compra</h3>

      <p className='desarrollo'>Has clic en el botón "Más Información" y una vez en la ficha descriptiva, selecciona la cantidad de entradas que deseas adquirir.</p>
      <p className='desarrollo'>Has clic en el botón "Ingresar E-mail", y completa tu dirección de e-mail. Por favor, confírmala.</p>
      <p className='desarrollo'>-A esa dirección de correo electrónico, recibirás las entradas que estás comprando para el evento, tan pronto como ingrese la confirmación del pago.</p>
      <p className='desarrollo'>Has clic en el botón "Comprar Entradas"</p>
      <p className='desarrollo'>Has clic en el botón de Compra de Mercado Pago para acceder a tu cuenta, y finalizar el pago desde allí.</p>
      <p className='desarrollo'>Tan pronto como terminas la operación, serás redirigido a nuestra página, y recibirás el e-mail con tus entradas.</p>
      <p className='desarrollo'>Las entradas que enviamos a tu e-mail, son generadas exclusivamente para ti. El código que las identifica, es único en cada caso.</p>
      

      <h3 id="metodosDePago" className='tituloInformacionAdministrativa'>Métodos de Pago</h3>

      <p className='desarrollo'>Trabajamos conectando con la plataforma de Mercado-Pago.</p>

      <h3 id="terminosCondiciones" className='tituloInformacionAdministrativa'>Términos y Condiciones</h3>
      <p className='desarrollo'>Al adquirir sus entradas a través de nuestra plataforma, cada comprador recibirá en el correo electrónico proporcionado una entrada con un código QR de identificación única. Es responsabilidad exclusiva del cliente garantizar que esta entrada no sea duplicada ni compartida indebidamente. El acceso al evento estará permitido únicamente a la primera persona que presente el código QR emitido, por lo que cualquier intento de 
        ingresar con una copia de la misma entrada será rechazado.</p>
      <p className='desarrollo'>En caso de cambios o modificaciones en los eventos, tales como cambios de fecha, lugar o cancelaciones, la responsabilidad recae completamente sobre el productor o productora del evento. Nosotros como plataforma no intervenimos en la 
        organización ni en las decisiones relacionadas con el desarrollo del evento.</p>
      <p className='desarrollo'>No se realizarán reembolsos por cambios o inasistencias, salvo en casos donde el evento sea cancelado. En dicha situación, será la productora quien determine el procedimiento para devolver los fondos a los participantes. Nuestra plataforma no se hace responsable de las 
        políticas de reembolso ni del tiempo que estas gestiones puedan tomar.</p>
      <p className='desarrollo'>Las transacciones de compra de entradas se procesan a través de la plataforma de Mercado Pago. Por lo tanto, solo se enviará el correo electrónico con las entradas una vez que recibamos la confirmación del pago exitoso por parte de Mercado Pago. Este correo será generado y enviado de manera 
        automática por nuestro sistema, una vez que el pago esté completamente procesado.</p>
      <p className='desarrollo'>Es importante destacar que, al realizar una compra en nuestra plataforma, el comprador acepta estas condiciones en su totalidad y reconoce que la responsabilidad de 
        verificar todos los detalles del evento y sus entradas es exclusivamente suya.</p>

      
    </div>
  )
}


export default GuiaDeCompra;