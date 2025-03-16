import React from 'react';
import './Error.css';
import logoError from "../../assets/error.png";
import Link from 'next/link';

const Error = () => {
  return (
    <div className='contenedorError'>

      <img src={logoError} alt="logo de error" className='logoError' />

      <p className='number'>- ERROR 404 -</p>

      <p className='tituloError'>Lo lamentamos, ha surgido un ERROR de conexión.</p>

      <Link className="volverAInicio" href='/'>Volver a Inicio</Link>

    </div>
  )
}

export default Error;