import { useEffect } from 'react';
import '../GuiaDeCompra/GuiaDeCompra.css';

export const GuiaDeCompra = () => {

   // Este useEffect asegura que la página se desplace hacia arriba al cargar el componente, me encanto!!
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // El array vacío indica que se ejecutará solo al montar el componente

  return (
    <div className='guiaDeCompraContainer'>
      <h2 className='tituloInformacionAdministrativa'>Guia de compra</h2>

      <p className='desarrollo'>Has clic en el botón "Más Información" y selecciona la cantidad de entradas que deseas adquirir.</p>
      <p className='desarrollo'>Has clic en el botón "Ingresar E-mail", y completa tu direccoión de e-mail. Por favor, confírmala.</p>
      <p className='desarrollo'>-A esa dirección de correo electrónico, recibirás las entradas que estás comprando para el evento, tan pronto como ingrese la confirmación del pago.</p>
      <p className='desarrollo'>Has clic en el botón "Comprar Entradas"</p>
      <p className='desarrollo'>Has clic en el botón de Compra de Mercado Pago.</p>
      <p className='desarrollo'>Tan pronto como terminas la operación, serás redirigido a nuestra página, y recibirás el e-mail con tus entradas.</p>
      <p className='desarrollo'>Las entradas que enviamos a tu e-mail, son generadas exclusivamente para ti. El código que las identifica, es único en cada caso.</p>
      

      <h2 className='tituloInformacionAdministrativa'>Métodos de Pago</h2>

      <p className='desarrollo'>Trabajamos conectando con la plataforma de Mercado-Pago.</p>

      <h2 className='tituloInformacionAdministrativa'>Preguntas Frecuentes</h2>
      <p className='desarrollo'>Comprando varias entradas, las recibiré como entradas individuales en mi e-mail?</p>
      <p className='desarrollo'>Llegarán al e-mail ingresado, la cantidad de entradas correspondientes a la compra, cada una con su código individual de autenticación.
        Cada QR tiene una clave única y es lo que garantiza tu acceso al evento.
      </p>
      
    </div>
  )
}


export default GuiaDeCompra;