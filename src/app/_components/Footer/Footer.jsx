import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './footer.scss'
import logoPalabra from '../../assets/nombreCalidad.png'
import Link from 'next/link'
import Image from 'next/image'
import logoEstr from '../../assets/isotipoEstrellas.png'


export const Footer = () => {
  return (
    <footer className='footer-container' id='footer'>

      <div className='contenedor-footer-principal'>

        <div className='contacto-redes-footer'>

          <Image className='logo-palabra-footer' src={logoPalabra} width={'40%'} height={'auto'} alt="logo de imperio ticket" />

          <div className='contacto-footer'>
            <h4>Puedes Contactarte con Nosotros <br/> vía e-mail</h4>

            <a href="mailto:imperioticket@gmail.com">imperiotickets@gmail.com</a>
          </div>

          <div className="social-icons">
            {/* Enlace a Instagram */}
            <a href="https://www.instagram.com/imperiotickets" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon="fab fa-instagram" />            
            </a>

            {/* Enlace a X (Twitter) */}
            <a href="https://twitter.com/tu_usuario" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon="fab fa-x-twitter" />            
            </a>

            {/* Enlace a Discord */}
            <a href="https://discord.com/invite/tu_invitacion" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon="fab fa-discord" />            
            </a>
          </div>

        </div>

        <div className='col-central-footer'>

          <Image className='planeta-footer' src={logoEstr} width={'28%'} alt="logo con estrellas" />

        </div>

        <div className='enlaces-footer'>
          <Link
            className='link-footer'
            href='/pages/guia-de-compra'
          >
            ◆ Guía de Compra
          </Link>

          <Link
            className='link-footer'
            href='/pages/guia-de-compra'
          >
            ◆ Medios de Pago
          </Link>

          <Link
            className='link-footer'
            href='/pages/atencion-al-cliente'
          >
            ◆ Atención al Cliente
          </Link>

          <Link
            className='link-footer'
            href='/pages/atencion-al-cliente'
          >
            ◆ Preguntas Frecuentes
          </Link>

          <Link
            className='link-footer'
            href='/pages/guia-de-compra'
          >
            ◆ Términos y Condiciones
          </Link>
        </div>

      </div>

    </footer>

  )
}


export default Footer
