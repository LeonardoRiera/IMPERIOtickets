//fue actualizado el header en el servidor a la version actual
import React, { useState } from 'react';
import '../Header/Header.css'
import logoFloat from '../../assets/logoblancoSinFondo1.png'
import starsFloat from '../../assets/FondoEstrellas.png'
import planeta from '../../assets/planeta.png'
import estrellasP from '../../assets/estrellasP.png'

export const Header = () => {

  const [rotateLogo, setRotateLogo] = useState(false);

  // Función para activar la rotación al hacer click
  const handleClick = () => {
    setRotateLogo(true); // Activa la rotación
    // Después de 1 segundo (el tiempo de la animación), reseteamos la rotación
    setTimeout(() => setRotateLogo(false), 1000); 
  };

  return (
    <div className='HeaderContainer container-fluid'>

      <div className='planetaContent'>
        <img src={planeta} alt="planeta" className='planeta' />
        <img src={estrellasP} alt="estrellas" className='estrellasP' />
      </div>

      <div className='tituloHeader'>
          <h2 className='titulo1'>Estás a un <span className='click'  onClick={handleClick}>CLICK</span></h2>
          <h2 className='titulo2'>del  mejor <span className='show'>Show</span> de tu <span className='vida'>VIDA!</span></h2>
      </div>
        
      <div className='logoEstrellasContent'>
        <img src={starsFloat} alt="estrellas flotando" className='starsFloat' />
        <img src={logoFloat} 
        alt="logo flotando" 
        className={`logoFloat ${rotateLogo ? 'rotate' : ''}`} /* // Aplica la clase 'rotate' si rotateLogo es true */ />
      </div>

    </div>
  )
}

export default Header;

