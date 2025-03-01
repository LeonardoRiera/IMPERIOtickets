import React from 'react';
import '../Failure/Failure.css';
import logoError from "../../assets/error.png";
import { Link } from "react-router-dom";

const Failure = () => {
  return (
    <div className='failureContainer'>
      <img src={logoError} alt="logo de error" className='logoError1' />

      <p className='number1'>- ERROR -</p>

      <p className='tituloError1'>Lo sentimos, tu pago no se ha podido procesar.</p>

      <p className='tituloError1'>. Verifica que los datos de tu tarjeta sean correctos y que tengas fondos suficientes</p>

      <p className='tituloError1'>. Intenta realizar el pago con otra tarjeta o método de pago disponible</p>

      <p className='tituloError1'>. Si el problema persiste, por favor contacta a nuestro equipo de soporte al cliente</p>

      <Link className="volverAInicio1" to='/'>Volver a Inicio</Link>
    </div>
  )
}

export default Failure