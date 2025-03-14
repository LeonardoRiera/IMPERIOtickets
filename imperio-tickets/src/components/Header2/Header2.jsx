'use client'
import React from "react";
import Image from "next/image";
import "./Header2.css";
import personaja1 from "../../assets/personaja1.webp";
import personaja2 from "../../assets/personaja3.webp";
import personaje3 from "../../assets/personaje2.webp";

const Header2 = () => {
  const images = [personaja1, personaje3, personaja2]; // Import de imágenes

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval); // Limpieza del intervalo
  }, []);

  return (
    <div className="header">
      <div className="image">
        {images.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Imagen ${index + 1}`}
            width={300}  // Puedes ajustar el tamaño
            height={400} // Ajusta según necesidad
            className={index === currentIndex ? "active" : ""}
          />
        ))}
      </div>

      <div className="textos">
        <h1 className="principal">
          Comprá tu <br />
          <span className="tickets">Ticket Digital</span>
        </h1>
        <h2 className="subtitle">Fácil y Seguro.</h2>
      </div>
    </div>
  );
};

export default Header2;
