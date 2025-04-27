'use client'

import styles from './AtencionCliente.module.css'

export default function AtencionCliente() {
  return (
    <div className={styles.backClientes}>
      <div className={styles.AtencionClienteContainer}>

        <h2 className={styles.tituloInformacionAtencion}>
          <a href="#atencionAlCliente">Atención al Cliente</a>

          <a href="#preguntasFrecuentes">Preguntas Frecuentes</a>
        </h2>

        <h3 className={styles.Atencionh3}>Servicio de Atención al Cliente</h3>

        <p className={styles.desarrollo}>
          Si tienes alguna consulta técnica o necesitas asistencia con tu compra, estamos aquí para ayudarte. 
          No dudes en contactarnos a través de nuestro correo electrónico imperiotickets@gmail.com y nos 
          pondremos en contacto contigo lo antes posible.
        </p>


        <h3 className={styles.Atencionh3}>Preguntas Frecuentes</h3>

        <p className={styles.desarrollo}>
          - ¿Qué hago si no he recibido mis entradas después de la compra?
        </p>

        <p className={styles.desarrollo}>
          Si no has recibido tus entradas, revisa primero tu bandeja de spam o correo no deseado. 
          Si no están allí, comunícate con nosotros a través de imperiotickets@gmail.com para que
          podamos reenviar las entradas o solucionar cualquier problema técnico.
        </p>

        <p className={styles.desarrollo}>
          - ¿Puedo cambiar la fecha o el evento de mis entradas después de la compra?
        </p>

        <p className={styles.desarrollo}>
          Lamentablemente, no podemos cambiar la fecha o el evento de tus entradas una vez que la 
          compra ha sido completada. Te recomendamos revisar cuidadosamente los detalles antes de 
          finalizar la compra. Si el evento ha sido modificado o cancelado, recibirás información 
          específica por correo.
        </p>

        <p className={styles.desarrollo}>
          - ¿Qué hago si me equivoqué en la cantidad de entradas compradas?
        </p>

        <p className={styles.desarrollo}>
          Si compraste más entradas de las que necesitas o cometiste un error al seleccionar la cantidad, 
          comunícate con nuestro equipo de atención al cliente lo antes posible a través de 
          imperiotickets@gmail.com. Haremos lo posible por ayudarte, aunque las políticas de reembolso 
          pueden variar según el evento.
        </p>

        <p className={styles.desarrollo}>
          - ¿Qué sucede si el evento que compré ha sido cancelado o reprogramado?
        </p>

        <p className={styles.desarrollo}>
          Si el evento ha sido cancelado, te informaremos sobre el proceso de reembolso por correo 
          electrónico. Si ha sido reprogramado, recibirás automáticamente las entradas para la nueva fecha.
        </p>

      </div>
    </div>
  )
}
