import React, { useState, useEffect } from 'react';
import Button from '../Button/Button'; // Importamos el componente del botón
import '../Card/Card.css'; // Importamos los estilos
import { Link } from 'react-router-dom';


const Card = ({ title, price, image, image2, imageDetail, dia, fecha, hora, lugar, description, clasificacion }) => {
  const [backgroundImage, setBackgroundImage] = useState(image); // Imagen por defecto

  useEffect(() => {
    const handleResize = () => {
      // Cambia la imagen si el ancho de la pantalla es menor o igual a 768px
      if (window.innerWidth <= 768) {
        setBackgroundImage(image2); // Imagen para móviles
      } else {
        setBackgroundImage(image);  // Imagen para pantallas grandes
      }
    };

    // Ejecutamos al montar el componente
    handleResize();

    // Escuchamos cambios en el tamaño de la ventana
    window.addEventListener('resize', handleResize);

    // Limpiamos el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [image, image2]); // Se re-ejecuta si cambian las imágenes

  return (
    <div className="card"
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover', // La imagen cubrirá todo el contenedor
      backgroundPosition: 'center', // Centramos la imagen
      backgroundRepeat: 'no-repeat', // Evitamos que la imagen se repita
    }}
    >

      
     
      <div className='datosContainer'>
        <div className='renglon'>
          <p className='dia texto'>{dia}</p>
          <p className='fecha texto'>{fecha}</p>
          <p className='hora texto'>{hora}</p>
        </div>
        <p className='lugar texto'>{lugar}</p>
      </div>
      <Link to={`/CardDetail`}  state={{ image, image2, imageDetail, title, price, dia, fecha, hora, lugar, description, clasificacion }}  className='buy-button'>Adquirir Entrada</Link>

      
        
      
      
    </div>
  );
};

export default Card;