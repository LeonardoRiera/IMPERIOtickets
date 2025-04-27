'use client'
import React from "react";
import Image from "next/image";
import "./LayoutBanners.scss";
import personaja1 from "../../assets/personaja1.webp";
import personaja2 from "../../assets/personaja3.webp";
import personaje3 from "../../assets/personaje2.webp";

const LayoutBanners = () => {
  const images = [personaja1, personaje3, personaja2];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="layout-banner">
      <div className="image">
        {images.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Imagen ${index + 1}`}
            width={300}  
            height={400} 
            className={index === currentIndex ? "active" : ""}
          />
        ))}
      </div>

      <div className="textos">
        <h1>
          Comprá tu <br />
          <span className="tickets">Ticket Digital</span>
        </h1>
        <h2>Fácil y Seguro.</h2>
      </div>
    </div>
  );
};

export default LayoutBanners;
