'use client'
import React from 'react';
import './Card.css';
import Link from 'next/link';

const Card = ({ title, price, image, image2, imageDetail, dia, fecha, hora, lugar, description, clasificacion }) => {

  const [backgroundImage, setBackgroundImage] = React.useState(image); // Imagen por defecto

  React.useEffect(() => {

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
  }, [image, image2]);

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

      <Link href={{pathname:'/pages/card-detail', query:{image, image2, imageDetail, title, price, dia, fecha, hora, lugar, description, clasificacion}}} className='buyButton'>Adquirir Entrada</Link>

    </div>
  );
};

export default Card;