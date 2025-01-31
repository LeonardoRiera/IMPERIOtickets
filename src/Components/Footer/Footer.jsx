import '../Footer/Footer.css'
import logoPalabra from '../../assets/nombreCalidad.png'
import { Link } from 'react-router-dom'
import planeta from '../../assets/planeta.png'


export const Footer = () => {
  return (
    <div className='footer-container container-fluid' id='footer'>

      {/* footer */}
      <div className='row contenedorFooterPrincipal '>

        
        <div className='col-lg-3 col-md-12 contactoRedesFooter'>

          <img className='logoPalabraFooter' src={logoPalabra} alt="logo de imperio ticket" />  
          
          <div className='contactoFooter'>
            <h4>Puedes Contactarte con Nosotros <br/> vía e-mail</h4>
            <a href="mailto:imperioticket@gmail.com">imperiotickets@gmail.com</a>
          </div>

          <div className="social-icons">
            {/* Enlace a Instagram */}
            <a href="https://www.instagram.com/tu_usuario" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-instagram"></i>
            </a>

            {/* Enlace a X (Twitter) */}
            <a href="https://twitter.com/tu_usuario" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-twitter"></i> {/* X usa el ícono de Twitter */}
            </a>

            {/* Enlace a Discord */}
            <a href="https://discord.com/invite/tu_invitacion" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-discord"></i>
            </a>
          </div>

        </div>

        <div className='col-lg-6 col-md-12 colCentralFooter'>
          
          <img className='planetaFooter' src={planeta} alt="" />  
          
        </div>

        <div className='col-lg-3 col-md-12 enlacesFooter'>
          <Link
            className='linkFooter'
            to='/GuiaCompra'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <i className='bi bi-diamond-fill icons'></i> Guía de Compra
          </Link>
          <Link
            className='linkFooter'
            to='/GuiaCompra'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <i className='bi bi-diamond-fill icons'></i> Medios de Pago
          </Link>
          <Link
            className='linkFooter'
            to='/AtencionAlCliente'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <i className='bi bi-diamond-fill icons'></i> Atención al Cliente
          </Link>
          <Link
            className='linkFooter'
            to='/AtencionAlCliente'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <i className='bi bi-diamond-fill icons'></i> Preguntas Frecuentes
          </Link>
          <Link
            className='linkFooter'
            to='/GuiaCompra'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <i className='bi bi-diamond-fill icons'></i> Términos y Condiciones
          </Link>
        </div>


      </div>

    </div>

  )
}


export default Footer
