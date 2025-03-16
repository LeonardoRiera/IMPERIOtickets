import React from 'react'
import AnimationSuccess from  '../../components/AnimationSuccess/AnimationSuccess.jsx'
import './Success.css'


const Success = () => {
  return (
    <div className='contenedorSuccess'>

      <AnimationSuccess />

      <p className='textoSuccessPrincipal'>Tu pago se ha procesado con <span className='exito'>éxito</span>.</p>

      <p className='textoSuccess'>¡Gracias por tu compra!</p>

      <p className='textoSuccess'> <i className="bi bi-diamond-fill diamont"></i> En breve recibirás un correo electrónico,

        <br /> donde tendrás los detalles de tu compra y el acceso a tus E-tickets.</p>

      <p className='textoSuccess'> <i className="bi bi-diamond-fill diamont"></i> Tu entrada está en un archivo PDF adjunto, que incluye un código QR único.</p>

      <p className='textoSuccess'> <i className="bi bi-diamond-fill diamont"></i> Puedes presentar el QR directamente desde tu celular el día del evento,

        <br /> si prefieres, también puedes imprimirlo.</p>

      <p className='textoSuccess'> <i className="bi bi-diamond-fill diamont"></i> Si no ves el correo en tu bandeja de entrada, revisa la carpeta de spam o correo no deseado.</p>

      <p className='textoSuccess'> <i className="bi bi-diamond-fill diamont"></i> Si tienes dudas, contácta nuestro soporte técnico escribiendo a imperiotickets@gmail.com</p>


    </div>
  )
}

export default Success