import { useState, useEffect } from "react";
import "../Header2/Header2.css";
import personaja1 from "../../assets/personaja1.webp";
import personaja2 from "../../assets/personaja3.webp"; 
import personaje3 from "../../assets/personaje2.webp";

const Header2 = () => {
  const images = [personaja1, personaje3, personaja2]; // Usando import para cargar imágenes correctamente
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval); // Limpieza del intervalo
  }, [images.length]); // Agregamos images.length al array de dependencias

  return (
    <div className="row header">
      <div className="col-sm-6 col-12 image">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Imagen ${index + 1}`}
            className={index === currentIndex ? "active" : ""}
          />
        ))}
      </div>
      <div className="col-sm-6 col-12 textos">
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
