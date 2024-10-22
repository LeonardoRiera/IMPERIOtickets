import React from 'react';
import '../Button/Button.css'; 
const Button = ({ onClick, disabled, className }) => {

  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={className}
    >
      Comprar
    </button>
  );
};

export default Button;