"use client"
import React from "react";
import './PanelAdminEvento.scss';
import {getEventoPorProductor} from '../../../../asyncMock';
import { useEffect, useState} from "react";
import Loader from '@/app/_components/Loader/Loader';

export const PanelAdminEvento = () => {
   
  const [eventos, setEventos] = useState(null)
  const [loading, setLoading] =useState(true)

  const idProductor = 101; //simulación del id del productor logueado

  useEffect(() => {

    getEventoPorProductor(idProductor)
    .then((res) => setEventos(res))
    .catch((err) => console.error('Error al obtener productores:', err))
    .finally(()=> setLoading(false))


  }, [])

  if (loading || !eventos) {
  return <Loader />;
  }


  return (
    <div className="adminContainer">
      <h2 className="textTitulo">Panel Administrativo para Productores</h2>

      

      <div className="datosContainer" >

        {eventos.map((evento) => (
        <div className="cardEvento" key={evento.id}>
          <h3 className="textEvento">Evento:{evento.nombre}</h3>
          <div className="totalVentas">
            <h4 className="textAdmin">Total Tickets Generados: <br /><span>{evento.ticketsVendidos}</span></h4>
            <h4 className="textAdmin">Total Ventas en Pesos: <br /><span>${evento.totalVentas}</span></h4>
            <p className="textAdmin">No incluye cargos por servicio</p>
          </div>
          <div className="totalVentasHoy">
             <h4 className="textAdmin">Ventas del Día</h4>
              <p className="textAdmin">Cantidad de Entradas: <br /><span>{evento.ticketsDiarios}</span></p>
              <p className="textAdmin">Dinero Ingresado: <br /><span>${evento.ventasDelDia.toLocaleString()}</span> </p>
              <p className="textAdmin">No incluye cargos por servicio</p>
          </div>

        </div>  
        ))}
      </div>
      

    </div>
  )
}


export default PanelAdminEvento;