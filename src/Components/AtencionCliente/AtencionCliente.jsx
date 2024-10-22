//ya actualizado a la version 0.6
import { useEffect } from 'react';
import '../AtencionCliente/AtencionCliente.css'

export const AtencionCliente = () => {

     // Este useEffect asegura que la página se desplace hacia arriba al cargar el componente, me encanto!!
     useEffect(() => {
      window.scrollTo(0, 0);
    }, []); // El array vacío indica que se ejecutará solo al montar el componente

  return (
    <div className='AtencionClienteContainer'>

        <h2 className='AtencionCliente'>Servicio de Atencion al Cliente</h2>
        <p className='desarrollo'>Una vez has elegido el evento al que quieres asistir, deberás hacer clic en el botón verde COMPRAR.</p>
        <p className='desarrollo'>Paso 1 - Rellena todos los datos que solicita la página: número de entradas que deseas adquirir (y código de descuento si procede) y 
        los datos tanto del comprador de las entradas (quien realiza el pago) como de la/s persona/s que asistirán al evento (para que las entradas estén personalizadas).
        </p>
        <p className='desarrollo'>Debes aceptar las condiciones para poder CONTINUAR CON LA COMPRA</p>
        <p className='desarrollo'>Paso 2 - Repasa los datos de la compra y si son correctos, confirma su veracidad y acepta las condiciones de compra.
        Podrás entonces elegir la forma de pago
        </p>
        <p className='desarrollo'>• PAGAR CON TARJETA el sistema conectará con la pasarela de pago y tras realizar éste  podrás descargar tus entradas. 
        Al mismo tiempo te serán enviadas a la dirección que indicaste en el Paso 1.
        </p>
        <p className='desarrollo'>Paso 3 - El sistema conecta con la pasarela de pago o bien te muestra el PDF con la reserva, 
        según la opción de pago elegida en el paso anterior
        </p>
        <p className='desarrollo'>Paso 4 - Si decidiste pagar con tarjeta, una vez efectuado el pago se generan tus entradas. Podrás descargarlas o esperar a recibirlas en tu mail, llegarán a los pocos minutos; 
        si no aparecen en la bandeja de entrada, comprueba la bandeja de correo no deseado (spam).
        </p>
        <p className='desarrollo'>Te recordamos que al ser las entradas nominales, el único responsable de la duplicidad de las mismas es el titular. Asegúrate de acudir al evento con la entrada impresa o con la suficiente batería en tu móvil para poder mostrarla en pantalla; 
        en caso contrario no podrás acceder al recinto.
        </p>

        <h2 className='Preguntas Frecuentes'>Preguntas Frecuentes</h2>
        <p className='desarrollo'>- Compre pero no me llegó la entrada, que hago? Ingresá en nuestro sitio, arriba a la derecha dice "acceder". Ahí usas tu mail y tu DNI como contraseña (la tenes que cambiar al primer uso) y te muestra todas tus compras.</p>
        <p className='desarrollo'>-Soy el titular de la compra y no puedo ir al show, ¿qué debo hacer?</p>
        <p className='desarrollo'>Es posible realizar una transferencia de entrada/s. Quién asista con tu/s entrada/s debe presentar junto con la/s misma/s una copia de tu DNI.</p>
        <p className='desarrollo'>-Soy el comprador y un asistente no puede ir al show, ¿es necesario el cambio de entrada o puedo transferirla?</p>
        <p className='desarrollo'>No es necesario el cambio. Podes transferir la entrada de ese asistente a otra persona. Si van a ingresar juntos/as no olvides llevar tu DNI para asegurarnos que la transferencia de la entrada es correcta. En caso que no puedan ingresar juntos/as que la otra persona lleve una copia de tu DNI para presentarlo con la entrada que fue transferida.</p>
        <p className='desarrollo'>-¿Debo realizar canje de entradas?</p>
        <p className='desarrollo'>No, todas las entradas adquiridas desde el sitio son válidas para ingresar.</p>
        <p className='desarrollo'>-¿Qué debo presentar al momento del control de acceso?</p>
        <p className='desarrollo'>Para poder ingresar sin inconvenientes debes presentar tu entrada impresa o mostrando el código QR del PDF de la misma desde tu celular. No olvides llevar tu DNI para corroborar los datos ante cualquier inconveniente.</p>
        <p className='desarrollo'>-¿Cómo funciona el control de acceso?</p>
        <p className='desarrollo'>Realizamos un escaneo de los códigos QR de las entradas para validarlas y evitar la duplicidad de la misma ya que cada entrada es única.</p>
        
    </div>
  )
}

export default AtencionCliente;
