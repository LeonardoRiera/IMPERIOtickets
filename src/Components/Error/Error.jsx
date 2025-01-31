import '../Error/Error.css';
import logoError from "../../assets/error.png";
import { Link } from "react-router-dom";
 

const Error = () => {
  return (
    <div className='contenedorError'>

      <img src={logoError} alt="logo de error" className='logoError' />
      <p className='number'>- ERROR 404 -</p>
      <p className='tituloError'>Lo lamentamos, ha surgido un ERROR de conexión.</p>
      <Link className="volverAInicio" to='/'>Volver a Inicio</Link>

    </div>
  )
}

export default Error;