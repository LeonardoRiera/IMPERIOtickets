import React from 'react'
import './Footer.css'
import logoPalabra from '../../assets/nombreCalidad.png'
import Link from 'next/link'
import Image from 'next/image'
import logoEstr from '../../assets/isotipoEstrellas.png'


export const Footer = () => {
  return (
    <div className='footer-container container-fluid' id='footer'>

      {/* footer */}
      <div className='row contenedorFooterPrincipal '>


        <div className='col-lg-3 col-md-12 contactoRedesFooter'>

          <Image className='logoPalabraFooter' src={logoPalabra} width={'100%'} height={'auto'} alt="logo de imperio ticket" />

          <div className='contactoFooter'>
            <h4>Puedes Contactarte con Nosotros <br/> vía e-mail</h4>

            <a href="mailto:imperioticket@gmail.com">imperiotickets@gmail.com</a>
          </div>

          <div className="social-icons">
            {/* Enlace a Instagram */}
            <a href="https://www.instagram.com/imperiotickets" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-instagram"></i>
            </a>

            {/* Enlace a X (Twitter) */}
            <a href="https://twitter.com/tu_usuario" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-twitter-x"></i>
            </a>

            {/* Enlace a Discord */}
            <a href="https://discord.com/invite/tu_invitacion" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-discord"></i>
            </a>
          </div>

        </div>

        <div className='colCentralFooter'>

          <Image className='planetaFooter' src={logoEstr} width={'28%'} alt="logo con estrellas" />

        </div>

        <div className='enlacesFooter'>
          <Link
            className='linkFooter'
            href='/pages/guia-de-compra'
          >
            <i className='bi bi-diamond-fill icons'></i> Guía de Compra
          </Link>

          <Link
            className='linkFooter'
            href='/pages/guia-de-compra'
          >
            <i className='bi bi-diamond-fill icons'></i> Medios de Pago
          </Link>

          <Link
            className='linkFooter'
            href='/pages/atencion-al-cliente'
          >
            <i className='bi bi-diamond-fill icons'></i> Atención al Cliente
          </Link>

          <Link
            className='linkFooter'
            href='/pages/atencion-al-cliente'
          >
            <i className='bi bi-diamond-fill icons'></i> Preguntas Frecuentes
          </Link>

          <Link
            className='linkFooter'
            href='/pages/guia-de-compra'
          >
            <i className='bi bi-diamond-fill icons'></i> Términos y Condiciones
          </Link>
        </div>


      </div>

    </div>

  )
}


export default Footer
