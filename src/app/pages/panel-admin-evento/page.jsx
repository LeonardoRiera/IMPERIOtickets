import React from "react";
import './PanelAdminEvento.css';


export const PanelAdminEvento = () => {
  return (
    <div className="Admin-Container">
      <h2>Panel Administrativo</h2>

      <div className="Datos-Container">

        <div className="Total-Ventas">
          <h3>Total Ventas en Pesos</h3>

          <p>$567.850,00</p>

          <p>No incluye cargos por servicio</p>
        </div>

        <div className="Tickets-Generados">
          <h3>Total de Tickets Generados</h3>

          <p>50</p>
        </div>

        <div className="Tickets-Disponibles">
          <h3>Total de Tickets aun Disponibles</h3>

          <p>120</p>
        </div>


        <div className="Total-Ventas-Hoy">
          <h3>Total Ventas del Día</h3>

          <p>$200.000,00</p>

          <p>No incluye cargos por servicio</p>

        </div>


      </div>


    </div>
  )
}


export default PanelAdminEvento;