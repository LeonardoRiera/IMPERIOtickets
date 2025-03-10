import React from 'react';
import './GuiaDeCompra.css';

export const GuiaDeCompra = () => {

  return (
    <div className='backCompra'>
      <div className='guiaDeCompraContainer'>

        {/* Enlaces de navegación */}
        <h2 className='tituloInformacionGuia'>
          <a href="#guiaDeCompra"><i className="bi bi-diamond-fill iconGuia"></i>Guía de Compra</a>

          <a href="#metodosDePago"><i className="bi bi-diamond-fill iconGuia"></i>Métodos de Pago</a>

          <a href="#terminosCondiciones"><i className="bi bi-diamond-fill iconGuia"></i>Términos y Condiciones</a>
        </h2>

        <h3 id="guiaDeCompra" className='tituloInformacionAdministrativa'>Guía de compra</h3>

        <p className='desarrollo'>. Has clic en el botón "Adquirir Entrada" en la ficha descriptiva de cada evento y/o recital.</p>

        <p className='desarrollo'>. Chequea los datos del evento - lugar, fecha, hora, precio, clasificación, etc -. Debajo selecciona la cantidad de entradas que quieres comprar, controla luego el precio y costos del servicio, en el total se veran reflejado la suma de estos.</p>

        <p className='desarrollo'>-Ingresa la dirección de correo electrónico donde recibirás las entradas que estás comprando para el evento tan pronto como ingrese la confirmación del pago. IMPORTANTE: controla bien que no haya errores en el correo y correo de confirmación.</p>

        <p className='desarrollo'>Has clic en el botón "Comprar Entradas", Tienes allí una última instancia de controlar que todos los datos de tu compra estén correctos</p>

        <p className='desarrollo'>Has clic en el botón de Compra de Mercado Pago para acceder a tu cuenta, y finalizar el pago desde allí.</p>

        <p className='desarrollo'>Tan pronto como terminas la operación, serás redirigido a nuestra página, y recibirás el e-mail con tus entradas.</p>

        <p className='desarrollo'>Las entradas que enviamos a tu e-mail, son generadas exclusivamente para ti. El código que las identifica, es único en cada caso.</p>


        <h3 id="metodosDePago" className='tituloInformacionAdministrativa'>Métodos de Pago</h3>

        <p className='desarrollo'>Trabajamos conectando con la plataforma de Mercado-Pago. Es allí y solo allí donde realizaras el pago de la entrada/s correspondiente.</p>

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
          verificar todos los detalles del evento y sus entradas es exclusivamente suya.
        </p>


      </div>
    </div>
  )
}


export default GuiaDeCompra;