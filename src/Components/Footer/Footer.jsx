import React from 'react'
import '../Footer/Footer.css'
import logoPalabra from '../../assets/ImperioTicketPalabra.png'
// import logoNegro from '../../assets/logo0.06.png'
import { Link } from 'react-router-dom'
import planeta from '../../assets/planeta.png'
import logoNegrito from '../../assets/logo0.06.png'

export const Footer = () => {
  return (
      <div className='footer-container container-fuid'>

        {/* footer */}
        <div className='row contenedorFooterPrincipal '>

          <div className='col-lg-3 col-md-12 enlacesFooter'>
            <Link className='linkFooter' to='/GuiaCompra'>Guía de Compra</Link>
            <Link className='linkFooter' to='/GuiaCompra'>Medios de Pago</Link>
            <Link className='linkFooter' to='/AtencionAlCliente'>Atención al Cliente</Link>
            <Link className='linkFooter' to='/AtencionAlCliente'>Preguntas Frecuentes</Link>
            <Link className='linkFooter' to='/GuiaCompra'>Términos y Condiciones</Link>
          </div>


          <div className='col-lg-6 col-md-12 colCentralFooter'>
            <img className='logoPalabraFooter' src={logoPalabra} alt="logo de imperio ticket" /> 
            <div className='planetaContenedorFooter'>
              <img className='planetaFooter' src={planeta} alt="" />  
            </div>
          </div>


          <div className='col-lg-3 col-md-12 contactoRedesFooter'>
            
            {/* Este logo solo se verá en pantallas pequeñas */}
            <img className="logoFooterResponsive" src={logoNegrito} alt="Logo para pantallas pequeñas" />
            
            
            <div className='contactoFooter'>
              <h4>Puedes Contactarte con Nosotros <br/> vía e-mail</h4>
              <a href="mailto:imperioticket@gmail.com">imperioticket@gmail.com</a>
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


        </div>





      </div>
      )
    }


export default Footer
